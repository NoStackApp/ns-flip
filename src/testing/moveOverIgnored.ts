import {names, standardIgnored} from '../constants'
const fs = require('fs-extra')

export async function moveOverIgnored(codeDir: string) {
  const testDir = `${codeDir}${names.TEST_DIR_SUFFIX}`
  await Promise.all(standardIgnored.map(async fileOrFolder => {
    await fs.copy(`${codeDir}/${fileOrFolder}`, `${testDir}/${fileOrFolder}`)
  }))
}
