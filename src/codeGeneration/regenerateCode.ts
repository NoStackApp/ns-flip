import {dirNames, fileNames, suffixes} from '../shared/constants'
import {getNsInfo} from '../shared/nsFiles/getNsInfo'
import {getConfig} from '../shared/configs/getConfig'
import {storeAddedCode} from './customCode/storeAddedCode'
import {copyCodeBaseToNewDir} from './customCode/copyCodeBaseToNewDir'
// import {ensureIgnoredExist} from '../testing/ensureIgnoredExist'
import {moveOverIgnored} from '../testing/moveOverIgnored'
import {generateCode} from './generateCode'
import {insertCustomChanges} from './customCode/insertCustomChanges'
import {updatePackageJson} from './packageJson/updatePackageJson'
import {setNsInfo} from '../shared/nsFiles/setNsInfo'
import {createSpecElement} from './codeBases/settings/specs/createSpecElement'
import {getPackageInfoJson} from './packageJson/getPackageInfoJson'
import {Schema} from '../shared/constants/types/schema'
import {buildSchema} from './schema/buildSchema'

const fs = require('fs-extra')

// async function restoreMetaDir(codeDir: string) {
//   const backupDir = `${codeDir}${suffixes.BACKUP_DIR}`
//   const backupMetaDir = `${backupDir}/${dirNames.META_DIR}`
//   const metaDir = `${codeDir}/${dirNames.META_DIR}`
//   await fs.remove(metaDir)
//
//   await execa(
//     'cp',
//     ['-r', backupMetaDir, metaDir],
//   ).catch(
//     (error: any) => {
//       throw new Error(`error restoring ${dirNames.META_DIR} from ${backupMetaDir}: ${error}`)
//     },
//   )
// }

export async function regenerateCode(codeDir: string, session: any) {
  const metaDir = `${codeDir}/${dirNames.META}`
  const nsInfo = await getNsInfo(codeDir)
  const starter = `${codeDir}${suffixes.STARTUP_DIR}`

  // WARNING: breaking change from 1.6.8!!
  // const config = await getConfiguration(template.dir)
  const templateDir = `${metaDir}/${dirNames.TEMPLATE}`
  const config = await getConfig(templateDir)

  const backupDir = `${codeDir}${suffixes.BACKUP_DIR}`

  if (!starter) throw new Error(`the '${fileNames.NS_FILE}' file contains no starter.  ` +
        'You need a starter to generate code.')

  try {
    // checkForUpdates()

    const {general} = config
    let generalSettings = nsInfo.general || {}

    if (Object.keys(generalSettings).length === 0) generalSettings = await createSpecElement(general, session)
    nsInfo.general = generalSettings
    await setNsInfo(codeDir, nsInfo)
    await storeAddedCode(codeDir, config)

    // replace the backup
    await fs.remove(backupDir)
    await copyCodeBaseToNewDir(codeDir, backupDir)
  } catch (error) {
    throw new Error(`could not generate the code: ${error}`)
  }

  // regenerate the code
  try {
    await copyCodeBaseToNewDir(starter, codeDir)
  } catch (error) {
    throw new Error(`could not copy code base: ${error}`)
  }

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
    const customCodeDoc = `${metaDir}/${fileNames.CUSTOM_CODE_FILE}`
    await new Promise(r => setTimeout(r, 2000))
    await insertCustomChanges(codeDir, customCodeDoc, config)

    const stackInfo: Schema = await buildSchema(nsInfo, config)
    const packageInfoJson = await getPackageInfoJson(
      templateDir,
      codeDir,
      nsInfo,
      stackInfo,
      config,
    )
    await updatePackageJson(codeDir, starter, packageInfoJson)
  } catch (error) {
    throw new Error(`could not insert custom changes: ${error}`)
  }
}
