const chalk = require('chalk')

import execa = require('execa');
import * as path from 'path'
import {
  regExReplacedCodeSectionGenerated,
  regExReplacedCodeSectionTagged,
} from '../constants/Regex/regExReplacedCodeSection'
import {commentOpen, locationSpec, endOfLine} from '../constants/Regex/regExShared'
import {
  CustomCodeByFile,
  CustomCodeCollection,
  CustomCodeRepository,
  FileCustomCode,
} from '../constants/types/custom'
import {regExCustomLocation} from '../constants/Regex/regExCustomLocation'
import {singularName} from '../shared/inflections'

const fs = require('fs-extra')

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

async function updateCustomCodeForFile(filePath: string, fileCustomCode: FileCustomCode) {
  let fileText: string

  try {
    fileText = await fs.readFile(filePath, 'utf-8')
  } catch (error) {
    throw new Error(`couldn't read the file ${filePath}`)
  }

  const {addedCode, replacedCode} = fileCustomCode

  fileText = fileText.replace(regExCustomLocation, function (
    match: string,
    p1: string,
    p2: string,
    p3: string,
    location: string,
  ) {
    if (!addedCode[location]) return match // this shouldn't happen

    const lines = match.split('\n')
    return lines[0] + '\n' + addedCode[location] + lines[lines.length - 1].trimLeft()
  })

  /*
      REPLACED CODE:
      The generated search looks for starts of sections,
      and then sees whether they are replaced.
      If so, changes start delimiter.

      NOTE: the reason for this step is that regex isn't handling embedded searches.
      Could be there's a way, but I haven't found it.  That is, if I have a section and a
      subsection, it will not see the subsection.  For instance, if section A contains
      a section A1, and A1 is replaced, just searching for sections will never find A1.
      Because once A is found, nothing in it will be searched further.

      So, I use this workaround: I look only for the starting delimiter.
      I check whether any such section is replaced.

      If it has been replaced, I tag it as such. I then search for the tagged
      "replacement" sections.
      This takes advantage of the fact that of course a section and a subsection within
      it cannot both be replaced.
   */
  //

  fileText = fileText.replace(regExReplacedCodeSectionGenerated, function (
    match: string,
    firstCommentOpen: string,
    unit: string,
    comp: string,
    location: string,
  ) {
    // console.log(`unit=${unit} comp=${comp} location=${location}`)

    if (!replacedCode[location]) return match
    // console.log(`replacement found: unit=${unit} comp=${comp} location=${location}`)
    return match.replace('ns__start_section', 'ns__start_replacement')
  })

  fileText = fileText.replace(regExReplacedCodeSectionTagged, function (
    match: string,
    firstCommentOpen: string,
    unit: string,
    comp: string,
    location: string,
    endOfLine: string,
    content: string,
    p7: string,
    commentOpen: string,
    finalEndOfLine: string,
  ) {
    // console.log(`unit=${unit} comp=${comp} location=${location}`)

    if (!replacedCode[location]) return match
    const lines = match.split('\n')
    // console.log(`firstCommentOpen=${firstCommentOpen}`)
    // console.log(`endOfLine=${endOfLine}`)
    // console.log(`content=${content}`)
    // console.log(`p7=${p7}`)
    // console.log(`commentOpen=${commentOpen}`)
    // console.log(`finalEndOfLine=${finalEndOfLine}`)
    const fullReplacement = lines[0] +
      '\n' + replacedCode[location] +
      commentOpen +
      ` ns__end_replacement unit: ${unit}, comp: ${comp}, loc: ${location}` +
      finalEndOfLine
    return fullReplacement
  })

  // clean up
  const delimiter = `${commentOpen} ns__(start|end)_(section|replacement) unit: ${locationSpec}${endOfLine}`
  const regExCleanUp = new RegExp(delimiter, 'g')

  fileText = fileText.replace(regExCleanUp, function (
    match: string,
    opening: string,
    prefix: string,
    type: string,
    p3: string,
    p4: string,
    location: string,
    endOfLine: string,
  ) {
    return `${opening} ns__${prefix}_${type} ${location}${endOfLine}`
  })

  const customDelimiter = `${commentOpen} ns__custom_(start|end) unit: ${locationSpec}${endOfLine}`
  const regExCustomCleanUp = new RegExp(customDelimiter, 'g')

  fileText = fileText.replace(regExCustomCleanUp, function (
    match: string,
    opening: string,
    prefix: string,
    p3: string,
    p4: string,
    location: string,
    endOfLine: string,
  ) {
    return `${opening} ns__custom_${prefix} ${location}${endOfLine}`
  })

  try {
    await fs.outputFile(filePath, fileText)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

function moveOverCodeSections(
  customCodeCollection: CustomCodeCollection,
  customCodeByFile: CustomCodeByFile,
  collectionType: string,
) {
  Object.keys(customCodeCollection).map(unit => {
    const unitInfo = customCodeCollection[unit]
    Object.keys(unitInfo).map(comp => {
      const compInfo = unitInfo[comp]
      const {path} = compInfo

      if (!customCodeByFile[path]) customCodeByFile[path] = {
        unit,
        comp,
        addedCode: {},
        replacedCode: {},
        removedCode: {},
      }

      Object.keys(compInfo).map(location => {
        if (location === 'path') return
        // @ts-ignore
        customCodeByFile[path][collectionType][location] = compInfo[location]
      })
      // console.log(`customCodeByFile[path]=${JSON.stringify(customCodeByFile[path])}`)
    })
  })

  return customCodeByFile
}

function customCodeToCodeByFile(customCodeRepository: CustomCodeRepository) {
  const {addedCode, replacedCode, removedCode} = customCodeRepository
  let customCodeByFile: CustomCodeByFile = {}
  customCodeByFile = moveOverCodeSections(addedCode, customCodeByFile, 'addedCode')
  customCodeByFile = moveOverCodeSections(replacedCode, customCodeByFile, 'replacedCode')
  customCodeByFile = moveOverCodeSections(removedCode, customCodeByFile, 'removedCode')

  return customCodeByFile
}

async function updateCustomCode(customCode: CustomCodeRepository, rootDir: string) {
  const customCodeByFile = customCodeToCodeByFile(customCode)
  try {
    await fs.outputJson(`${rootDir}/meta/custom.json`, customCodeByFile)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }

  await Promise.all(Object.keys(customCodeByFile).map(async relativePath => {
    const filePath = `${rootDir}/${relativePath}`
    try {
      if (await fs.pathExists(filePath)) {
        await updateCustomCodeForFile(filePath, customCodeByFile[relativePath])
      } else {
        // eslint-disable-next-line no-console
        console.log(`***WARNING*** the file ${relativePath} does not exist ` +
        'but has custom code in your current version.  That probably means ' +
        'that the file is in the wrong location.')
      }
    } catch (error) {
      // console.error(error)
      throw new Error(`couldn't update ${filePath}. rootDir=${rootDir}.`)
    }
  }))
}

export const insertCustomChanges = async (rootDir: string, addedCodeDoc: string) => {
  const baseDir = path.resolve(process.cwd(), rootDir)
  // const gruntDir = path.resolve(__dirname, '../..')

  // console.log(`gruntDir=${gruntDir}`)
  // console.log(`appDir=${baseDir}`)
  // console.log(`addedCodeJsonFile=${addedCodeJsonFile}`)

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

  // await updateAddedImports(customCode, testDir)
  await updateRemovedImports(customCode, rootDir)

  await Promise.all(Object.keys(customCode.addedCode))

  // console.log(`about to call grunt:
  //    $ ${gruntDir}/node_modules/.bin/grunt --testDir=${baseDir} --addedCodeDoc=${addedCodeDoc} --base=${gruntDir}
  // `)
  // await execa(
  //   `${gruntDir}/node_modules/.bin/grunt`,
  //   ['--testDir=' + baseDir, '--addedCodeDoc=' + addedCodeDoc, `--base=${gruntDir}`],
  // ).catch(
  //   (error: any) => {
  //     throw new Error(`${chalk.red('error inserting added code.')} Here is the error reported:\n${error}`)
  //   },
  // )
}
