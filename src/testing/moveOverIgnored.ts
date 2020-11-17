import {standardIgnored} from '../constants'
import {Configuration} from '../constants/types/configuration'
// import execa = require('execa');
const fs = require('fs-extra')

export async function moveOverIgnored(sourceDir: string, updatedDir: string, config: Configuration) {
  // const testDir = `${sourceDir}${names.TEST_DIR_SUFFIX}`
  let allIgnored = [...standardIgnored]
  if (config.ignore)
    allIgnored = [...allIgnored, ...config.ignore]
  allIgnored.push(config.dirs.custom)

  await Promise.all(allIgnored.map(async fileOrFolder => {
    try {
      if (await fs.pathExists(`${sourceDir}/${fileOrFolder}`)) {
        // await execa(
        //   'cp',
        //   ['-r', `${sourceDir}/${fileOrFolder}`, `${updatedDir}/${fileOrFolder}`],
        // )
        await fs.copy(`${sourceDir}/${fileOrFolder}`, `${updatedDir}/${fileOrFolder}`)
      }
    } catch (error) {
      // console.log(error)
      throw new Error(`couldn't copy over ${fileOrFolder} from ${sourceDir} to ${updatedDir}: ${error}`)
    }
  }))
}
