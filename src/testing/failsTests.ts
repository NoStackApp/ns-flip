import {copyCodeBaseToNewDir} from '../codeGeneration/customCode/copyCodeBaseToNewDir'
import {generateCode} from '../codeGeneration/generateCode'
import {insertCustomChanges} from '../codeGeneration/customCode/insertCustomChanges'
import {storeAddedCode} from '../codeGeneration/customCode/storeAddedCode'
import {magicStrings, suffixes} from '../shared/constants'
import {getNsInfo} from '../shared/nsFiles/getNsInfo'
import {getConfig} from '../shared/configs/getConfig'
import {checkDirForDiscrepancies} from './checkDirForDiscrepancies'
// import {mergePackageJsons} from './mergePackageJsons'
import {moveOverIgnored} from './moveOverIgnored'
// import writePackage = require('write-pkg');

const fs = require('fs-extra')

export async function failsTests(codeDir: string) {
  const metaDir = `${codeDir}/${magicStrings.META_DIR}`
  const starter = `${codeDir}${suffixes.STARTUP_DIR}`
  const testDir = `${codeDir}${suffixes.TEST_DIR}`
  const testMetaDir = `${testDir}/${magicStrings.META_DIR}`

  const diffsFile = `${testMetaDir}/${magicStrings.DIFFS}`
  const logFile = `${testMetaDir}/${magicStrings.TESTS_LOG}`

  const nsInfo = await getNsInfo(codeDir)

  const templateDir = `${metaDir}/${magicStrings.TEMPLATE}`

  // WARNING: breaking change from 1.6.8!!
  // const config = await getConfiguration(template.dir)
  const config = await getConfig(templateDir)

  let problemsFound = false
  if (!starter) throw new Error(`the '${magicStrings.NS_FILE}' file contains no starter.  ` +
    'You need a starter to test the code.')

  // store added code before generating new code.
  await storeAddedCode(codeDir, config)

  try {
    await fs.remove(testDir)
    await copyCodeBaseToNewDir(starter, testDir)
    await moveOverIgnored(codeDir, testDir, config)
    // const mergedJson = await mergePackageJsons(starter, codeDir)
    // await writePackage(`${testDir}/package.json`, mergedJson)

    await generateCode(testDir, nsInfo, config)

    const customCodeDoc = `${metaDir}/${magicStrings.CUSTOM_CODE_FILE}`
    await insertCustomChanges(testDir, customCodeDoc, config)
  } catch (error) {
    throw error
  }

  // this.log('*** temporary injected return for testing ***')
  // return // temp

  try {
    problemsFound = await checkDirForDiscrepancies(
      diffsFile,
      codeDir,
      testDir,
      logFile,
      problemsFound,
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw new Error(`problem found with the testing: ${error}`)
  }

  return problemsFound
}
