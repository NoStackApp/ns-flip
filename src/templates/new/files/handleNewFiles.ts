import * as chalk from 'chalk'
import {Result} from 'dir-compare'
import {getConfig} from '../../../shared/configs/getConfig'
import {setConfig} from '../../../shared/configs/setConfig'

const inquirer = require('inquirer')
const fs = require('fs-extra')
const newFileOptions = {
  REMOVE: 'Update setupSequence to remove it',
  COPY: 'copy it over to the sample',
  NOTHING: 'Nothing.  I am not sure.',
}

function getNewFileQuestions(fileName: string) {
  return [
    {
      type: 'list',
      name: 'newFileTreatment',
      message: `This file ${chalk.red(fileName)} is showing up only in your generated code, not in your sample.  What would you like done?`,
      choices: [newFileOptions.REMOVE, newFileOptions.COPY, newFileOptions.NOTHING],
    },
  ]
}

async function copyFileToSample(relativePath: string, codeDir: string, sampleDir: string) {
  try {
    fs.copy(codeDir + '/' + relativePath, sampleDir + '/' + relativePath)
  } catch (error) {
    throw new Error(`cannot copy ${relativePath} from ${codeDir} to ${sampleDir}: ${error}`)
  }
}

export async function handleNewFiles(
  res: Result,
  templateDir: string,
  code: string,
  sample: string
) {
  if (res.diffSet) {
    const newFileInfo = res.diffSet.filter((file: any) => (file.type2 === 'missing'))
    const newFiles = newFileInfo.map((file: any) => {
      const filePath = file.relativePath.substring(1) + '/' + file.name1
      return filePath.replace(/\/\//g, '/')
    })

    const config = await getConfig(templateDir)

    const newFilesForPrompt: string[] = []
    newFiles.map(relativeFilePath => {
      if (relativeFilePath.startsWith('meta')) {
        copyFileToSample(relativeFilePath, code, sample)
      } else {
        newFilesForPrompt.push(relativeFilePath)
      }
    })
    let i = 0
    for (i = 0; i < newFilesForPrompt.length; i++) {
      const newFileName = newFilesForPrompt[0]
      const newFileQuestions = getNewFileQuestions(newFileName)
      const answers = await inquirer.prompt(newFileQuestions)
      const {newFileTreatment} = answers
      if (newFileTreatment === newFileOptions.REMOVE) {
        if (!config) throw new Error('no config file in the specified template.')
        if (!config.setupSequence) config.setupSequence = {}
        if (!config.setupSequence.preCommands) config.setupSequence.preCommands = []
        config.setupSequence.preCommands.push({
          title: 'remove ' + newFileName,
          file: 'rm',
          arguments: [`$codeDir/${newFileName}`],
        })
        await setConfig(templateDir, config)
      }
      if (newFileTreatment === newFileOptions.COPY) {
        await copyFileToSample(newFileTreatment, code, sample)
      }
    }
  }
}
