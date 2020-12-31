import {Result} from 'dir-compare'
import * as chalk from 'chalk'
import {setConfig} from '../../shared/configs/setConfig'
import {attention, progress} from '../../shared/constants/chalkColors'
import {Configuration} from '../../shared/constants/types/configuration'
import {commentDelimiters} from '../commentDelimiters'

const fs = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')
const prependFile = require('prepend-file')

const oldFileOptions = {
  ADD: 'Add it into the template',
  MOVE: 'Move it into the custom directory',
  IGNORE: 'Add it to the template ignore',
  NOTHING: 'Nothing.  I am not sure.',
}

const customFileTexts = {
  STANDARD: 'standard file: exactly one such file will always be created',
  STATIC: 'static file: a set number of such files will be created for each code base',
  DYNAMIC: 'dynamic file: an unknown number of such files will be created dynamically at run time',
  UNKNOWN: 'I am not sure.',
}

const customFileTypes = {
  STANDARD: 'standard',
  STATIC: 'static',
  DYNAMIC: 'dynamic',
  UNKNOWN: 'unknown',
}

const customFileOptions = [
  {
    value: customFileTypes.STANDARD,
    short: customFileTypes.STANDARD,
    name: customFileTexts.STANDARD,
  },
  {
    value: customFileTypes.STATIC,
    short: customFileTypes.STATIC,
    name: customFileTexts.STATIC,
  },
  {
    value: customFileTypes.DYNAMIC,
    short: customFileTypes.DYNAMIC,
    name: customFileTexts.DYNAMIC,
  },
  {
    value: customFileTypes.UNKNOWN,
    short: customFileTypes.UNKNOWN,
    name: customFileTexts.UNKNOWN,
  },
  {
    value: customFileTypes.UNKNOWN,
    short: customFileTypes.UNKNOWN,
    name: customFileTexts.UNKNOWN,
  },

]

function getOldFileQuestions(fileName: string) {
  return [
    {
      type: 'list',
      name: 'newFileTreatment',
      message: `This file ${chalk.red(fileName)} is showing up only in your model code, not being generated.  What would you like done?`,
      choices: Object.values(oldFileOptions),
    },
  ]
}

function getCustomTypeQuestions(fileName: string) {
  return [
    {
      type: 'list',
      name: 'fileClassification',
      message: `Classify this file ${attention(fileName)} into one of the following types of generated files`,
      choices: Object.values(customFileOptions),
    },
  ]
}

function stripLeadingForwardSlash(fileName: string) {
  if (fileName.startsWith('/')) return fileName.slice(1)
  return fileName
}

async function handleIgnoringFile(
  fileName: string, templateDir: string, config: Configuration
) {
  const {ignore} = config
  if (ignore)
    config.ignore?.push(fileName)
  else
    config.ignore = [fileName]
  await setConfig(templateDir, config)
  // eslint-disable-next-line no-console
  console.log(progress(`placed ${fileName} into the list of ignored files...`))
  return config
}

function getCommentDelimitersForFile(fileName: string, config: Configuration) {
  const ext = path.extname(fileName)
  console.log(`in getCommentDelimitersForFile, fileName=${fileName} ext=${ext}`)
  console.log(`commentDelimiters(ext, config)=${JSON.stringify(commentDelimiters(ext, config))}`)
  return commentDelimiters(ext, config)
}

function standardFileInfoLine(fileName: string, config: Configuration) {
  const delimiters = getCommentDelimitersForFile(fileName, config)
  return `${delimiters.open} unit: standard, comp: ${fileName}${delimiters.close}`
}

async function handleAddingFile(
  fileName: string,
  templateDir: string,
  modelDir: string,
  config: Configuration
) {
  const classificationAnswers = await inquirer.prompt(getCustomTypeQuestions(fileName))
  const {fileClassification} = classificationAnswers

  if (fileClassification === customFileTypes.STANDARD) {
    const originalFilePath = modelDir + '/' + fileName
    const finalPath = `${templateDir}/standard/${fileName}.hbs`

    try {
      await fs.copy(originalFilePath,
        finalPath,)
    } catch (error) {
      throw new Error(`copying to standard directory: ${error}`)
    }

    try {
      // prepend file info line to original file to avoid a discrepancy
      const fileInfoLine = standardFileInfoLine(fileName, config)
      await prependFile(originalFilePath, fileInfoLine)
    } catch (error) {
      throw new Error(`copying to standard directory: ${error}`)
    }
  }
  // eslint-disable-next-line no-console
  console.log(progress(`added ${fileName} to the template as a ${fileClassification} file type...`))
}

export async function handleUniqueModelFiles(
  res: Result,
  templateDir: string,
  modelDir: string,
  config: Configuration
) {
  if (!res || !res.diffSet) return

  const nonGeneratedFileInfo = res.diffSet.filter((file: any) => (file.type1 === 'missing'))
  const nonGeneratedFiles = nonGeneratedFileInfo.map((file: any) => {
    return file.relativePath.substring(1) + '/' + file.name2
  })

  if (nonGeneratedFiles.length === 0) {
    // eslint-disable-next-line no-console
    console.log(chalk.red('No files in the model code are not being generated.'))
    return
  }

  // eslint-disable-next-line no-console
  console.log(chalk.red('Files in the model code not being generated:'))
  // eslint-disable-next-line no-console

  let i
  for (i = 0; i < nonGeneratedFiles.length; i++) {
    const newFileName = nonGeneratedFiles[i]
    const finalFileName = stripLeadingForwardSlash(newFileName)
    const isDirectory = await fs.lstatSync(`${modelDir}/${finalFileName}`).isDirectory()
    if (isDirectory) continue // for now, we are just ignoring them and looking at their contents
    const answers = await inquirer.prompt(getOldFileQuestions(newFileName))
    const {newFileTreatment} = answers
    if (newFileTreatment === oldFileOptions.ADD) {
      await handleAddingFile(
        finalFileName, templateDir, modelDir, config
      )
    }
    if (newFileTreatment === oldFileOptions.IGNORE) {
      await handleIgnoringFile(
        finalFileName,
        templateDir,
        config
      )
    }
    if (newFileTreatment === oldFileOptions.MOVE) {
      // eslint-disable-next-line no-console
      console.log(progress(`moved ${newFileName} to custom inside of model...`))
    }
  }
}
