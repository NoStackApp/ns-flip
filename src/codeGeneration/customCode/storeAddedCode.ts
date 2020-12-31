import {dirNames, fileNames} from '../../shared/constants'
// const findInFiles = require('find-in-files')
// import {regExFileInfo} from '../constants/Regex/regExFileInfo'
import {CustomCodeRepository} from '../../shared/constants/types/custom'
import {Configuration} from '../../shared/constants/types/configuration'
import {storeCustomCodeForFile} from './storeCustomCodeForFile'

const fs = require('fs-extra')

const globby = require('globby')
// const readdir = require('@mrmlnc/readdir-enhanced')
// const recursive = require('recursive-readdir')

// const regEx = /(\/\/|{\/\*) np__added_start unit: (\w*), comp: (\w*), loc: (\w*)( \*\/\}\n|\n)((.|\n)*?)(\/\/|{\/\*) np__added_end/g

async function storeCustomCodeRegions(
  rootDir: string,
  customCode: CustomCodeRepository,
  customCodeFile: string,
  config: Configuration
) {
  const fileNameFormat = config.format.customFileFilter
  const {custom} = config.dirs
  const exludeModules = `node_modules/**/${fileNameFormat}`
  const general = `${rootDir}/**/${fileNameFormat}`
  const nodeModules = `!${rootDir}/${exludeModules}`
  const customModules = `!${rootDir}/${custom}/**/${fileNameFormat}`
  const files = await globby([general, nodeModules, customModules])
  // console.log(`number of files: ${files.length} files = ${JSON.stringify(files)}`)

  let i
  for (i = 0; i < files.length; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      customCode = await storeCustomCodeForFile(
        files[i], customCode, rootDir, config
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Error(`problem storing custom code for ${files[i]}]`)
    }
  }

  await fs.writeJson(
    customCodeFile, customCode, {spaces: 2}
  )
  return customCode
}

export const storeAddedCode = async (rootDir: string, config: Configuration) => {
  // const compsDir = `${rootDir}/src/${names.COMP_DIR}`
  if (!await fs.pathExists(rootDir)) return
  const metaDir = `${rootDir}/${dirNames.META}`
  const customCodeFile = `${metaDir}/${fileNames.CUSTOM_CODE_FILE}`

  const customCode: CustomCodeRepository = {
    addedCode: {},
    replacedCode: {},
    removedCode: {},
  }

  try {
    return storeCustomCodeRegions(
      rootDir, customCode, customCodeFile, config
    )
  } catch (error) {
    throw new Error(`can't store custom code: ${error}`)
  }
}
