import {standardIgnored} from '../../shared/constants'
import {NsInfo} from '../../shared/constants/types/nsInfo'
import {Schema} from '../../shared/constants/types/schema'
import {contextForStandard} from '../handlebars/context/contextForStandard'
import {loadFileTemplate} from '../../templates/loadFileTemplate'
import {registerHelpers} from '../handlebars/registerHelpers'
import {registerPartials} from '../handlebars/registerPartials'
import {replaceCommentDelimiters} from './replaceCommentDelimiters'
import {getConfig} from '../../shared/configs/getConfig'

const fs = require('fs-extra')
const path = require('path')
const walk = require('walkdir')

const options = {
  mode: 0o2775,
}

export async function standardFiles(
  templateDir: string,
  codeDir: string,
  nsInfo: NsInfo,
  stackInfo: Schema,
) {
  const standardDir = `${templateDir}/standard`
  const config = await getConfig(templateDir)

  try {
    await registerPartials(`${templateDir}/partials`)
    await registerHelpers(`${templateDir}/helpers`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw new Error(`error registering the partials or helpers at ${templateDir}.
It may be that the template location is faulty, or that the template is not
correctly specified:
${error}`)
  }

  const paths = walk.sync(standardDir, {return_object: true})
  await Promise.all(Object.keys(paths).map(async pathString => {
    const stat = paths[pathString]
    const localPath = pathString.replace(standardDir, '')
    if (localPath in standardIgnored) return

    const newPath = `${codeDir}${localPath}`

    if (stat.isDirectory()) {
      try {
        await fs.ensureDir(newPath, options)
      } catch (error) {
        throw error
      }
      return
    }

    const parsed = path.parse(newPath)
    const {ext} = parsed

    if (ext !== '.hbs') {
      // a literal file.  E.g. README.md.
      try {
        fs.copy(pathString, newPath)
      } catch (error) {
        throw new Error(`couldn't copy over file ${pathString}: ${error}`)
      }
      return
    }

    const fileTemplate = await loadFileTemplate(pathString)
    const newFileName = path.join(parsed.dir, parsed.name)
    const newLocalFileName = newFileName.replace(codeDir + '/', '')

    const fileText = await fileTemplate(await contextForStandard(
      nsInfo,
      stackInfo,
      newLocalFileName,
      codeDir,
      config,
    ))
    const finalFileText = replaceCommentDelimiters(pathString, config, fileText)
    // console.log(`finalFileText for ${pathString}=${finalFileText}`)
    await fs.outputFile(newFileName, finalFileText)
  }))
  // const emitter = walk(standardDir)

  // emitter.on('file', async function (fileName: any) {
  //   const localPath = fileName.replace(standardDir + '/', '')
  //   if (localPath in standardIgnored) return
  //   const newPath = `${codeDir}/${localPath}`
  //   const parsed = path.parse(newPath)
  //   const {ext} = parsed
  //
  //   if (ext !== '.hbs') {
  //     // a literal file.  E.g. README.md.
  //     try {
  //       fs.copyFile(fileName, newPath)
  //     } catch (error) {
  //       throw new Error(`couldn't copy over file ${fileName}: ${error}`)
  //     }
  //     return
  //   }
  //
  //   const fileTemplate = await loadFileTemplate(fileName)
  //   const newFileName = path.join(parsed.dir, parsed.name)
  //   const newLocalFileName = newFileName.replace(codeDir + '/', '')
  //
  //   const fileText = await fileTemplate(await contextForStandard(
  //     nsInfo,
  //     stackInfo,
  //     newLocalFileName,
  //     codeDir
  //   ))
  //
  //   console.log(`newFileName =${newFileName}`)
  //   console.log(`fileText =${fileText}`)
  //   await fs.outputFile(newFileName, fileText)
  // })

  // emitter.on('directory', async function (path: any) {
  //   const localPath = path.replace(standardDir, '')
  //   const newPath = `${codeDir}${localPath}`
  //   try {
  //     // await fs.ensureDir(childrenCodeDir, options)
  //     await fs.ensureDir(newPath, options)
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     throw error
  //   }
  // })
}
