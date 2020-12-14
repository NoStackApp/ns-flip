import {magicStrings, suffixes} from '../shared/constants'
import {getNsInfo} from '../shared/nsFiles/getNsInfo'
import {getConfig} from '../shared/configs/getConfig'
import {checkForUpdates} from '../shared/checkForUpdates'
import {storeAddedCode} from './customCode/storeAddedCode'
import {copyCodeBaseToNewDir} from './customCode/copyCodeBaseToNewDir'
// import {ensureIgnoredExist} from '../testing/ensureIgnoredExist'
import {moveOverIgnored} from '../testing/moveOverIgnored'
import {generateCode} from './generateCode'
import {insertCustomChanges} from './customCode/insertCustomChanges'
import {updatePackageJson} from './updatePackageJson'
import {setNsInfo} from '../shared/nsFiles/setNsInfo'
import {createSpecElement} from './codeBases/settings/specs/createSpecElement'

const fs = require('fs-extra')

// async function restoreMetaDir(codeDir: string) {
//   const backupDir = `${codeDir}${suffixes.BACKUP_DIR}`
//   const backupMetaDir = `${backupDir}/${magicStrings.META_DIR}`
//   const metaDir = `${codeDir}/${magicStrings.META_DIR}`
//   await fs.remove(metaDir)
//
//   await execa(
//     'cp',
//     ['-r', backupMetaDir, metaDir],
//   ).catch(
//     (error: any) => {
//       throw new Error(`error restoring ${magicStrings.META_DIR} from ${backupMetaDir}: ${error}`)
//     },
//   )
// }

export async function regenerateCode(codeDir: string) {
  const metaDir = `${codeDir}/${magicStrings.META_DIR}`
  const nsInfo = await getNsInfo(codeDir)
  const starter = `${codeDir}${suffixes.STARTUP_DIR}`

  // WARNING: breaking change from 1.6.8!!
  // const config = await getConfiguration(template.dir)
  const templateDir = `${metaDir}/${magicStrings.TEMPLATE}`
  const config = await getConfig(templateDir)

  const backupDir = `${codeDir}${suffixes.BACKUP_DIR}`

  if (!starter) throw new Error(`the '${magicStrings.NS_FILE}' file contains no starter.  ` +
        'You need a starter to generate code.')

  try {
    checkForUpdates()

    const {general} = config
    let generalSettings = nsInfo.general || []

    console.log(`general=${JSON.stringify(general, null, 2)}`)
    generalSettings = await createSpecElement(general)
    console.log(`nsInfo=${JSON.stringify(nsInfo, null, 2)}`)
    nsInfo.general = generalSettings
    await setNsInfo(codeDir, nsInfo)

    // store added code before generating new code.
    await storeAddedCode(codeDir, config)

    // replace the backup
    await fs.remove(backupDir)
    await copyCodeBaseToNewDir(codeDir, backupDir)
    await fs.remove(codeDir)
  } catch (error) {
    throw new Error(`could not replace the backup: ${error}`)
  }

  // regenerate the code
  try {
    await copyCodeBaseToNewDir(starter, codeDir)
  } catch (error) {
    throw new Error(`could not copy code base: ${error}`)
  }

  // try {
  //   await restoreMetaDir(codeDir)
  // } catch (error) {
  //   console.error(JSON.stringify(error))
  //   throw new Error(`could not restore meta dir: ${error}`)
  // }

  try {
    await moveOverIgnored(backupDir, codeDir, config)
  } catch (error) {
    throw new Error(`could not move over ignored: ${error}`)
  }

  try {
    await generateCode(codeDir, nsInfo, config)
  } catch (error) {
    throw new Error(`could not regenerate the code: ${error}`)
  }

  try {
    const customCodeDoc = `${metaDir}/${magicStrings.CUSTOM_CODE_FILE}`
    await new Promise(r => setTimeout(r, 2000))
    await insertCustomChanges(codeDir, customCodeDoc, config)

    await updatePackageJson(codeDir, starter)
  } catch (error) {
    throw new Error(`could not insert custom changes: ${error}`)
  }
}
