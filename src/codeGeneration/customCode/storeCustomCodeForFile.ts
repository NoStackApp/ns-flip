import {CustomCodeRepository} from '../../constants/types/custom'
import {customLocationRegExString} from '../../constants/Regex/regExCustomLocation'
import {customLocationNewRegExString} from '../../constants/Regex/regExNewCustomLocation'
import {replacedRexExText} from '../../constants/Regex/regExReplacedCodeSection'
import {getFileInfo} from './getFileInfo'

export const fs = require('fs-extra')

const regexRemovedTest = '\\/\\/ ns__remove_import (\\w*)'
const regExRemoved = new RegExp(regexRemovedTest, 'g')

function removeRootDir(filePath: string, rootDir: string) {
  return filePath.replace(rootDir + '/', '')
}

export async function storeCustomCodeForFile(
  filePath: string,
  customCode: CustomCodeRepository,
  rootDir: string
) {
  // if (filePath.endsWith('Item/index.jsx'))
  // console.log(`in storeCustomCodeForFile customCode=${JSON.stringify(customCode, null, 1)}`)

  const {addedCode, replacedCode, removedCode} = customCode

  const fileText = await fs.readFile(filePath, 'utf-8')
  const fileInfo = getFileInfo(fileText)

  const regExCustomLocation = new RegExp(customLocationRegExString, 'g')
  let match

  // eslint-disable-next-line no-cond-assign
  while (match = regExCustomLocation.exec(fileText)) {
    // if (!output[match[1]])

    const unit: string = match[2]
    const component: string = match[3]
    const location: string = match[4]

    // const firstLineEnding = match[5]
    let contents = match[6]
    // console.log(`match found: unit: ${unit} component: ${component} location: ${location} contents: ${contents}`)

    if (!contents || contents === '') contents = ' '

    if (!addedCode[unit]) addedCode[unit] = {}
    if (!addedCode[unit][component]) {
      addedCode[unit][component] = {
        path: removeRootDir(filePath, rootDir),
      }
    }
    addedCode[unit][component][location] = contents
  }

  const regExNewCustomLocation = new RegExp(customLocationNewRegExString, 'g')
  // eslint-disable-next-line no-cond-assign
  while (match = regExNewCustomLocation.exec(fileText)) {
    const {unit, component} = fileInfo
    const location: string = match[2]

    let contents = match[4]
    // console.log(`match found: unit: ${unit} component: ${component} location: ${location} contents: ${contents}`)

    if (!contents || contents === '') contents = ' '

    if (!addedCode[unit]) addedCode[unit] = {}
    if (!addedCode[unit][component]) {
      addedCode[unit][component] = {
        path: removeRootDir(filePath, rootDir),
      }
    }
    addedCode[unit][component][location] = contents
  }

  const regExReplacedCodeSection = new RegExp(replacedRexExText, 'g')
  // eslint-disable-next-line no-cond-assign
  while (match = regExReplacedCodeSection.exec(fileText)) {
    // if (!output[match[1]])
    const {unit, component} = fileInfo
    const location = match[2]
    // const firstLineEnding = match[5]
    let contents = match[4]
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
