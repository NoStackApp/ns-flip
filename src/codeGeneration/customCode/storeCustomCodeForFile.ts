import {CustomCodeRepository} from '../../shared/constants/types/custom'
import {customLocationNewRegExString} from '../../shared/constants/Regex/regExNewCustomLocation'
import {replacedRexExText} from '../../shared/constants/Regex/regExReplacedCodeSection'
import {getFileInfo} from './getFileInfo'
import {Configuration} from '../../shared/constants/types/configuration'
import {commentDelimiters} from '../../templates/commentDelimiters'

const fs = require('fs-extra')
const path = require('path')

const regexRemovedTest = '\\/\\/ ns__remove_import (\\w*)'
const regExRemoved = new RegExp(regexRemovedTest, 'g')

function removeRootDir(filePath: string, rootDir: string) {
  return filePath.replace(rootDir + '/', '')
}

export async function storeCustomCodeForFile(
  filePath: string,
  customCode: CustomCodeRepository,
  rootDir: string,
  config: Configuration,
) {
  // if (filePath.endsWith('Item/index.jsx'))
  // console.log(`in storeCustomCodeForFile customCode=${JSON.stringify(customCode, null, 1)}`)
  const ext = path.extname(filePath)
  const delimiters = commentDelimiters(ext, config)

  const {addedCode, replacedCode, removedCode} = customCode

  const fileText = await fs.readFile(filePath, 'utf-8')
  const fileInfo = getFileInfo(fileText, delimiters)

  let match

  // const regExCustomLocation = new RegExp(customLocationRegExString(delimiters), 'g')
  //
  // // eslint-disable-next-line no-cond-assign
  // while (match = regExCustomLocation.exec(fileText)) {
  //   // if (!output[match[1]])
  //
  //   const unit: string = match[2]
  //   const component: string = match[3]
  //   const location: string = match[4]
  //
  //   // const firstLineEnding = match[5]
  //   let contents = match[6]
  //   console.log(`match found: unit: ${unit} component: ${component} location: ${location} contents: ${contents}`)
  //
  //   if (!contents || contents === '') contents = ' '
  //
  //   if (!addedCode[unit]) addedCode[unit] = {}
  //   if (!addedCode[unit][component]) {
  //     addedCode[unit][component] = {
  //       path: removeRootDir(filePath, rootDir),
  //     }
  //   }
  //   addedCode[unit][component][location] = contents
  // }

  const regExNewCustomLocation = new RegExp(customLocationNewRegExString(delimiters), 'g')
  // eslint-disable-next-line no-cond-assign
  while (match = regExNewCustomLocation.exec(fileText)) {
    const {unit, component} = fileInfo
    const location: string = match[1]

    let contents = match[2]
    // console.log(`match found: ${match}... unit: ${unit} component: ${component} location: ${location} contents: ${contents}`)

    if (!contents || contents === '') contents = ' '

    if (!addedCode[unit]) addedCode[unit] = {}
    if (!addedCode[unit][component]) {
      addedCode[unit][component] = {
        path: removeRootDir(filePath, rootDir),
      }
    }
    addedCode[unit][component][location] = contents
  }

  const regExReplacedCodeSection = new RegExp(replacedRexExText(delimiters), 'g')
  // eslint-disable-next-line no-cond-assign
  while (match = regExReplacedCodeSection.exec(fileText)) {
    // if (!output[match[1]])
    const {unit, component} = fileInfo
    const location = match[1]
    // const firstLineEnding = match[5]
    let contents = match[2]
    if (!contents || contents === '') contents = ' '
    // const firstLineEnding = match[5]

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
    const {unit, component} = fileInfo
    const location = match[1]
    // console.log(`**MATCH FOUND** for remove in ${file}: unit: ${unit} component: ${component} location: ${location}`)
    if (!removedCode[unit]) removedCode[unit] = {}
    if (!removedCode[unit][component])
      removedCode[unit][component] = {
        path: removeRootDir(filePath, rootDir),
      }
    removedCode[unit][component][location] = 'true'
  }

  return customCode
}
