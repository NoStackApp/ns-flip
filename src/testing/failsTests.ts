import {copyCodeBaseToNewDir} from '../codeGeneration/copyCodeBaseToNewDir'
import {generateCode} from '../codeGeneration/generateCode'
import {insertAddedCode} from '../codeGeneration/insertAddedCode'
import {storeAddedCode} from '../codeGeneration/storeAddedCode'
import {names} from '../constants'
import {getCodeInfo} from '../constants/getCodeInfo'
import {getConfiguration} from '../constants/getConfiguration'
import {checkDirForDiscrepancies} from './checkDirForDiscrepancies'

const fs = require('fs-extra')

export async function failsTests(codeDir: string) {
  const metaDir = `${codeDir}/${names.META_DIR}`
  const testDir = `${codeDir}${names.TEST_DIR_SUFFIX}`
  const testMetaDir = `${testDir}/${names.META_DIR}`

  const diffsFile = `${testMetaDir}/${names.DIFFS}`
  const logFile = `${testMetaDir}/${names.TESTS_LOG}`

  const nsYml = `${metaDir}/${names.NS_FILE}`
  const nsInfo = await getCodeInfo(nsYml)

  const {template, starter} = nsInfo
  const config = await getConfiguration(template.dir)

  let problemsFound = false
  if (!starter) throw new Error(`the '${names.NS_FILE}' file contains no starter.  ` +
    'You need a starter to test the code.')

  // store added code before generating new code.
  await storeAddedCode(codeDir, config)

  try {
    await fs.remove(testDir)
    await copyCodeBaseToNewDir(starter, testDir)

    await generateCode(testDir, nsInfo, config)

    const customCodeDoc = `${metaDir}/${names.CUSTOM_CODE_FILE}`
    await insertAddedCode(testDir, customCodeDoc)
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
