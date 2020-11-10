import {updateCustomCode} from './updateCustomCode'
import * as path from 'path'
import {CustomCodeRepository} from '../../constants/types/custom'
import {singularName} from '../../shared/inflections'

const chalk = require('chalk')

import execa = require('execa');
import {fs} from './updateCustomCodeForFile'

async function updateCode(
  fileName: string,
  sedString: string,
) {
  await execa(
    'sed',
    ['-i', '-e ' + sedString, fileName],
  ).catch(
    (error: any) => {
      throw new Error(`${chalk.red('error inserting added code.')} Here is the error reported:\n${error}`)
    },
  )
}

async function updateRemovedImports(customCode: CustomCodeRepository, testDir: string) {
  const {removedCode} = customCode
  Object.keys(removedCode).map(unit => {
    const unitInfo = removedCode[unit]
    Object.keys(unitInfo).map(comp => {
      const compInfo = unitInfo[comp]
      Object.keys(compInfo).map(async location => {
        const fileName = `${testDir}/src/components/${singularName(unit)}/${comp}/index.jsx`
        const sedString = `s/^\\(\\s*\\)import ${location}/\\1\\/\\/ns__remove_import ${location}/g`
        await updateCode(fileName, sedString)
      })
    })
  })
}

export const insertCustomChanges = async (rootDir: string, addedCodeDoc: string) => {
  const baseDir = path.resolve(process.cwd(), rootDir)

  const existsComponents = await fs.pathExists(addedCodeDoc)
  // console.log(`existsComponents=${existsComponents}`)

  let customCode: CustomCodeRepository = {
    addedCode: {},
    replacedCode: {},
    removedCode: {},
  }
  if (!existsComponents) {
    try {
      await fs.writeJson(addedCodeDoc, customCode)
    } catch (error) {
      throw error
    }
    return
  }

  customCode = await fs.readJson(addedCodeDoc)
  // const customCodeByFile = customCodeToCodeByFile(customCode)
  // console.log(`customCodeByFile=${JSON.stringify(customCodeByFile)}`)
  await updateCustomCode(customCode, baseDir)

  if (Object.keys(customCode).length === 0) {
    // no added code to add
    return
  }

  // const compsDir = baseDir + '/src/components/'
  // const files = readdir.sync(compsDir, {deep: true, filter: '**/*.{js,jsx}'})
  // console.log(`files: ${JSON.stringify(files, null, 2)}`)

  // let i
  // for (i = 0; i < files.length; i++) {
  //   const file = compsDir + files[i]
  //   // eslint-disable-next-line no-await-in-loop
  //   await insertCustomCodeForFile(file, customCode)
  // }

  await updateRemovedImports(customCode, rootDir)

  await Promise.all(Object.keys(customCode.addedCode))
}