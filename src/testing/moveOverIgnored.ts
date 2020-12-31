import {Configuration} from '../shared/constants/types/configuration'
import {getIgnoredList} from '../shared/configs/getIgnoredList'
// import execa = require('execa');
const fs = require('fs-extra')

export async function moveOverIgnored(
  sourceDir: string, updatedDir: string, config: Configuration
) {
  // const testDir = `${sourceDir}${names.TEST_DIR_SUFFIX}`
  const allIgnored = getIgnoredList(config)

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
