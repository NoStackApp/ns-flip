import {Command, flags} from '@oclif/command'
import {copyCodeBaseToNewDir} from '../codeGeneration/copyCodeBaseToNewDir'

import {generateCode} from '../codeGeneration/generateCode'
import {insertAddedCode} from '../codeGeneration/insertAddedCode'
import {storeAddedCode} from '../codeGeneration/storeAddedCode'
import {names} from '../constants'
import {checkForUpdates} from '../shared/checkForUpdates'
import {getCodeInfo} from '../shared/getCodeInfo'
import {getConfiguration} from '../shared/getConfiguration'
import {isRequired} from '../inputs/isRequired'
import {ensureIgnoredExist} from '../testing/ensureIgnoredExist'
import execa = require('execa')

const fs = require('fs-extra')

async function restoreMetaDir(codeDir: string) {
  const backupDir = `${codeDir}${names.BACKUP_DIR_SUFFIX}`
  const backupMetaDir = `${backupDir}/${names.META_DIR}`
  const metaDir = `${codeDir}/${names.META_DIR}`
  await fs.remove(metaDir)

  await execa(
    'cp',
    ['-r', backupMetaDir, metaDir],
  ).catch(
    (error: any) => {
      throw new Error(`error restoring ${names.META_DIR} from ${backupMetaDir}: ${error}`)
    },
  )
}

function isRequiredForRegenerate(paramName: string, flag: string) {
  return isRequired(paramName, 'regenerate', flag)
}

export default class Regenerate extends Command {
  static description = 'regenerates code based on a meta file `ns.yml`,' +
    ' custom changes, and a starter.' +
    ' The code directory must have been created for the first time using `newcode`.'

  static examples = [
    '$ nd regenerate -c ~/temp/myapp',
  ]

  static flags = {
    codeDir: flags.string({char: 'c', description: 'code directory'}),
    help: flags.help({char: 'h'}),
  }

  static args = []

  async run() {
    const {flags} = this.parse(Regenerate)

    const codeDir = flags.codeDir || isRequiredForRegenerate('codeDir', 'c')

    const metaDir = `${codeDir}/${names.META_DIR}`
    const nsYml = `${metaDir}/${names.NS_FILE}`
    const nsInfo = await getCodeInfo(nsYml)

    const {template, starter} = nsInfo
    const config = await getConfiguration(template.dir)
    const oldDir = `${codeDir}${names.BACKUP_DIR_SUFFIX}`

    if (!starter) throw new Error(`the '${names.NS_FILE}' file contains no starter.  ` +
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

      // copy the backup
      await fs.remove(oldDir)
      await copyCodeBaseToNewDir(codeDir, oldDir)
      await fs.remove(codeDir)

      // regenerate the code
      await copyCodeBaseToNewDir(starter, codeDir)
      await restoreMetaDir(codeDir)
      await ensureIgnoredExist(codeDir)
      // const mergedJson: object = await mergePackageJsons(starter, codeDir)
      // // @ts-ignore
      // await writePackage(`${codeDir}/package.json`, mergedJson)

      await generateCode(codeDir, nsInfo, config)

      const addedCodeDoc = `${metaDir}/${names.CUSTOM_CODE_FILE}`
      await insertAddedCode(codeDir, addedCodeDoc)
    } catch (error) {
      this.log(error)
      throw new Error(`when creating the code: ${error}`)
    }
  }
}
