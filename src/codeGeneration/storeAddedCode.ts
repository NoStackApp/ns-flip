
import {names} from '../constants'

// const findInFiles = require('find-in-files')
import {regExAddedCodeSection} from '../constants/Regex/regExAddedCodeSection'
// import {regExFileInfo} from '../constants/Regex/regExFileInfo'
import {regExReplacedCodeSection} from '../constants/Regex/regExReplacedCodeSection'
import {CustomCodeRepository} from '../constants/types/custom'
import {Configuration} from '../constants/types/schema'

const fs = require('fs-extra')
const globby = require('globby')
// const readdir = require('@mrmlnc/readdir-enhanced')
// const recursive = require('recursive-readdir')

// const regEx = /(\/\/|{\/\*) np__added_start unit: (\w*), comp: (\w*), loc: (\w*)( \*\/\}\n|\n)((.|\n)*?)(\/\/|{\/\*) np__added_end/g

function removeRootDir(filePath: string, rootDir: string) {
  return filePath.replace(rootDir + '/', '')
}

async function storeCustomCodeForFile(
  filePath: string,
  customCode: CustomCodeRepository,
  rootDir: string
) {
  // if (filePath.endsWith('.md'))
  //   console.log(`in storeCustomCodeForFile filePath=${filePath}`)

  const {addedCode, replacedCode, removedCode} = customCode

  // console.log(`for file ${filePath}`)
  const fileText = await fs.readFile(filePath, 'utf-8')
  let fileUnit = ''
  let fileComponent = ''

  // temp
  const regexTextTest = '\\/\\/ ns__file unit: (\\w*), comp: (\\w*)'
  const regExFileInfoTest = new RegExp(regexTextTest, 'g')
  const regexRemovedTest = '\\/\\/ ns__remove_import (\\w*)'
  const regExRemoved = new RegExp(regexRemovedTest, 'g')

  const fileInfoMatch = regExFileInfoTest.exec(fileText)

  if (fileInfoMatch) {
    fileUnit = fileInfoMatch[1]
    fileComponent = fileInfoMatch[2]
    // console.log(`file=${file}: fileUnit=${fileUnit}, fileComponent=${fileComponent}`)
  } else {
    // console.log(`DIDN'T WORK! regExFileInfoTest.exec(fileText)=${JSON.stringify(regExFileInfoTest.exec(fileText))}`)
  }
  // console.log(`fileText: ${fileText}`)

  let match
  // eslint-disable-next-line no-cond-assign
  while (match = regExAddedCodeSection.exec(fileText)) {
    // if (!output[match[1]])
    const unit: string = match[2]
    const component: string = match[3]
    const location: string = match[4]

    // const firstLineEnding = match[5]
    let contents = match[6]
    if (!contents || contents === '') contents = ' '

    if (!addedCode[unit]) addedCode[unit] = {}
    if (!addedCode[unit][component]) {
      addedCode[unit][component] = {
        path: removeRootDir(filePath, rootDir),
      }
    }
    addedCode[unit][component][location] = contents
  }

  // eslint-disable-next-line no-cond-assign
  while (match = regExReplacedCodeSection.exec(fileText)) {
    // if (!output[match[1]])
    const unit = fileUnit
    const component = fileComponent
    const location = match[2]
    // const firstLineEnding = match[5]
    let contents = match[4]
    if (!contents || contents === '') contents = ' '
    // const firstLineEnding = match[5]

    // console.log(`match found: unit: ${unit} component: ${component} location: ${location} contents: ${contents}`)
    // console.log(`**MATCH FOUND** for replace in ${file}: unit: ${unit} component: ${component} location: ${location}`)
    if (!replacedCode[unit]) replacedCode[unit] = {}
    if (!replacedCode[unit][component])
      replacedCode[unit][component] = {
        path: removeRootDir(filePath, rootDir),
      }
    replacedCode[unit][component][location] = contents
  }

  // eslint-disable-next-line no-cond-assign
  while (match = regExRemoved.exec(fileText)) {
    // if (!output[match[1]])
    const unit = fileUnit
    const component = fileComponent
    const location = match[1]
    // console.log(`**MATCH FOUND** for remove in ${file}: unit: ${unit} component: ${component} location: ${location}`)
    if (!removedCode[unit]) removedCode[unit] = {}
    if (!removedCode[unit][component])
      removedCode[unit][component] = {
        path: removeRootDir(filePath, rootDir),
      }
    removedCode[unit][component][location] = 'true'
  }
}

async function storeCustomCodeRegions(
  rootDir: string,
  customCode: CustomCodeRepository,
  customCodeFile: string,
  config: Configuration
) {
  const fileNameFormat = config.format.codeFileFilter
  const {custom} = config.dirs
  const exludeModules = `node_modules/**/${fileNameFormat}`
  const general = `${rootDir}/**/${fileNameFormat}`
  const nodeModules = `!${rootDir}/${exludeModules}`
  const customModules = `!${rootDir}/${custom}/**/${fileNameFormat}`
  const files = await globby([general, nodeModules, customModules])
  // console.log(`number of files: ${files.length}`)

  let i
  for (i = 0; i < files.length; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await storeCustomCodeForFile(files[i], customCode, rootDir)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Error(`problem storing custom code for ${files[i]}]`)
    }
  }

  // console.log(`addedCode: ${JSON.stringify(customCode, null, 2)}`)
  await fs.writeJson(customCodeFile, customCode)
  return customCode
}

export const storeAddedCode = async (rootDir: string, config: Configuration) => {
  const compsDir = `${rootDir}/src/${names.COMP_DIR}`
  const metaDir = `${rootDir}/${names.META_DIR}`
  const customCodeFile = `${metaDir}/${names.CUSTOM_CODE_FILE}`

  const existsComponents = await fs.pathExists(compsDir)
  if (!existsComponents) return

  const customCode: CustomCodeRepository = {
    addedCode: {},
    replacedCode: {},
    removedCode: {},
  }

  return storeCustomCodeRegions(rootDir, customCode, customCodeFile, config)
}
