import {NsInfo} from '../constants/types/nsInfo'
import {Schema} from '../constants/types/schema'
import {contextForStandard} from './contextForStandard'
import {loadFileTemplate} from './loadFileTemplate'
import {registerHelpers} from './registerHelpers'
import {registerPartials} from './registerPartials'

const fs = require('fs-extra')
const path = require('path')
const walk = require('walkdir')
// const yaml = require('js-yaml')

const options = {
  mode: 0o2775,
}

export async function standardFiles(
  templateDir: string,
  appDir: string,
  appInfo: NsInfo,
  stackInfo: Schema,
) {
  const standardDir = `${templateDir}/standard`

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

  const emitter = walk(standardDir)

  emitter.on('file', async function (fileName: any) {
    const localPath = fileName.replace(standardDir, '')
    const newPath = `${appDir}${localPath}`
    const parsed = path.parse(newPath)
    const {ext} = parsed

    if (ext !== '.hbs') {
      // a literal file.  E.g. README.md.
      try {
        fs.copyFile(fileName, newPath)
      } catch (error) {
        throw new Error(`couldn't copy over file ${fileName}: ${error}`)
      }
      return
    }

    const fileTemplate = await loadFileTemplate(fileName)
    const newFileName = path.join(parsed.dir, parsed.name)
    // const {ext} = parsed.ext
    // if (ext !== '.hbs') {
    //   throw new Error(`the file ${filename} in the template standard dir
    //   does not end with the .hbs extension.  The only files permitted must have
    //   the .hbs extension.`)
    // }

    const fileText = await fileTemplate(contextForStandard(appInfo, stackInfo, parsed.name.replace(/\./g, '')))
    await fs.outputFile(newFileName, fileText)
  })

  emitter.on('directory', async function (path: any) {
    const localPath = path.replace(standardDir, '')
    const newPath = `${appDir}${localPath}`
    try {
      // await fs.ensureDir(childrenAppDir, options)
      await fs.ensureDir(newPath, options)
    } catch (error) {
      // eslint-disable-next-line no-console
      throw error
    }
  })
}
