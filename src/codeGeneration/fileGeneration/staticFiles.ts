import {NsInfo} from '../../constants/types/nsInfo'
import {Schema} from '../../constants/types/schema'
import {loadFileTemplate} from '../../templates/loadFileTemplate'
import {registerHelpers} from '../handlebars/registerHelpers'
import {registerPartials} from '../handlebars/registerPartials'
import {Configuration} from '../../constants/types/configuration'
import {magicStrings} from '../../constants'
import {contextForStatic} from '../handlebars/context/contextForStatic'
import {replaceCommentDelimiters} from './replaceCommentDelimiters'

const fs = require('fs-extra')

// const options = {
//   mode: 0o2775,
// }

// async function createStaticFile (filename: any, path: string) {
//   // const fileTemplate = await loadFileTemplate(filename)
//   // const localPath = filename.replace(standardDir, '')
//   // const newPath = `${codeDir}${localPath}`
//   // const parsed = path.parse(newPath)
//   // const newFileName = path +
//   // const {ext} = parsed.ext
//   // if (ext !== '.hbs') {
//   //   throw new Error(`the file ${filename} in the template standard dir
//   //   does not end with the .hbs extension.  The only files permitted must have
//   //   the .hbs extension.`)
//   // }
//
//   // const fileText = await fileTemplate(contextForStandard(appInfo, stackInfo, parsed.name))
//   // await fs.outputFile(newFileName, fileText)
// }
//

export async function staticFiles(
  templateDir: string,
  codeDir: string,
  nsInfo: NsInfo,
  stackInfo: Schema,
  config: Configuration,
) {
  // const staticDirLocalPath = config.dirs.static
  // if (!staticDirLocalPath) return
  // const staticDir = `${codeDir}/${staticDirLocalPath}`

  const staticInfo = nsInfo.static
  if (!staticInfo) return
  const staticTypesWithFiles = Object.keys(staticInfo)

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

  await Promise.all(staticTypesWithFiles.map(async (staticType: string) => {
    const staticTypeInfo = config.static[staticType]
    if (!staticTypeInfo) throw new Error(`app.yml refers to static type ${staticType} ` +
      'not defined in the template')
    const fileTypeList = Object.keys(staticTypeInfo)

    const instancesForType = staticInfo[staticType]
    const instanceNamesForType = Object.keys(instancesForType)

    instanceNamesForType.map(async instance => {
      const instanceInfo = instancesForType[instance]
      fileTypeList.map(async (fileType: string) => {
        const fileTypeInfo: any = staticTypeInfo[fileType]
        const {name, suffix, directory} = fileTypeInfo

        const pathString = `${templateDir}/static/${fileType}.hbs`

        try {
          const fileTemplate = await loadFileTemplate(pathString)

          const {slug, specs} = instanceInfo
          const fileName = name.replace(magicStrings.SLUG_PLACEHOLDER, slug) + suffix
          const fullFilePath = `${codeDir}/${directory}/${fileName}`

          const context = await contextForStatic(staticType, specs, slug, instance, fileName, nsInfo, config, codeDir)
          const fileText = await fileTemplate(context)
          const finalFileText = replaceCommentDelimiters(pathString, config, fileText)

          await fs.outputFile(fullFilePath, finalFileText)
        } catch (error) {
          throw new Error(`with pathString ${pathString}, could not generate static file: ${error}`)
        }
      })
    })
  }))
}
