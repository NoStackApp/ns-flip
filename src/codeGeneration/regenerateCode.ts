import execa = require('execa');
import {magicStrings} from '../constants'
import {getCodeInfo} from '../shared/getCodeInfo'
import {getConfiguration} from '../shared/getConfiguration'
import {checkForUpdates} from '../shared/checkForUpdates'
import {storeAddedCode} from './storeAddedCode'
import {copyCodeBaseToNewDir} from './copyCodeBaseToNewDir'
// import {ensureIgnoredExist} from '../testing/ensureIgnoredExist'
import {moveOverIgnored} from '../testing/moveOverIgnored'
import {generateCode} from './generateCode'
import {insertCustomChanges} from './insertCustomChanges'

const fs = require('fs-extra')

async function restoreMetaDir(codeDir: string) {
  const backupDir = `${codeDir}${magicStrings.BACKUP_DIR_SUFFIX}`
  const backupMetaDir = `${backupDir}/${magicStrings.META_DIR}`
  const metaDir = `${codeDir}/${magicStrings.META_DIR}`
  await fs.remove(metaDir)

  await execa(
    'cp',
    ['-r', backupMetaDir, metaDir],
  ).catch(
    (error: any) => {
      throw new Error(`error restoring ${magicStrings.META_DIR} from ${backupMetaDir}: ${error}`)
    },
  )
}

export async function regenerateCode(codeDir: string) {
  const metaDir = `${codeDir}/${magicStrings.META_DIR}`
  const nsYml = `${metaDir}/${magicStrings.NS_FILE}`
  const nsInfo = await getCodeInfo(nsYml)

  const {template, starter} = nsInfo
  const config = await getConfiguration(template.dir)
  const backupDir = `${codeDir}${magicStrings.BACKUP_DIR_SUFFIX}`

  if (!starter) throw new Error(`the '${magicStrings.NS_FILE}' file contains no starter.  ` +
        'You need a starter to generate code.')

  try {
    checkForUpdates()

    // // for now, this is removed.
    // const problemsFound = await failsTests(codeDir)
    // if (problemsFound)
    //   throw new Error('generation is not possible right now, because at least one test ' +
    //     'of the code base is failing.  That means that generating will remove custom' +
    //     'changes.  Please run \'test\' for more information.  If you want to regenerate' +
    //     'even though changes will be lost, you may run \'regenerate\' with the \'--force\'' +
    //     'flag.  (Usually not recommended)')

    // store added code before generating new code.
    await storeAddedCode(codeDir, config)

    // replace the backup
    await fs.remove(backupDir)
    await copyCodeBaseToNewDir(codeDir, backupDir)
    await fs.remove(codeDir)

    // regenerate the code
    await copyCodeBaseToNewDir(starter, codeDir)
    await restoreMetaDir(codeDir)
    // await ensureIgnoredExist(codeDir)
    // const mergedJson: object = await mergePackageJsons(starter, codeDir)
    // // @ts-ignore
    // await writePackage(`${codeDir}/package.json`, mergedJson)

    await moveOverIgnored(backupDir, codeDir, config)
    await generateCode(codeDir, nsInfo, config)

    const customCodeDoc = `${metaDir}/${magicStrings.CUSTOM_CODE_FILE}`
    await insertCustomChanges(codeDir, customCodeDoc)
  } catch (error) {
    // console.log(error)
    throw new Error(`could not regenerate the code: ${error}`)
  }
}