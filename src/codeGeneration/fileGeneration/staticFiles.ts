import {NsInfo} from '../../shared/constants/types/nsInfo'
import {Schema} from '../../shared/constants/types/schema'
import {loadFileTemplate} from '../../templates/loadFileTemplate'
import {registerHelpers} from '../handlebars/registerHelpers'
import {registerPartials} from '../handlebars/registerPartials'
import {Configuration} from '../../shared/constants/types/configuration'
import {placeholders} from '../../shared/constants'
import {contextForStatic} from '../handlebars/context/contextForStatic'
import {replaceCommentDelimiters} from './replaceCommentDelimiters'

const fs = require('fs-extra')

export async function staticFiles(
  templateDir: string,
  codeDir: string,
  nsInfo: NsInfo,
  stackInfo: Schema,
  config: Configuration,
) {
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
    const fileTypeList = Object.keys(staticTypeInfo.files)

    const instancesForType = staticInfo[staticType]
    const instanceNamesForType = Object.keys(instancesForType)

    instanceNamesForType.map(async instance => {
      const instanceInfo = instancesForType[instance]
      fileTypeList.map(async (fileType: string) => {
        const fileTypeInfo: any = staticTypeInfo.files[fileType]
        const {name, suffix, directory} = fileTypeInfo

        const pathString = `${templateDir}/static/${fileType}.hbs`

        try {
          const fileTemplate = await loadFileTemplate(pathString)

          const {slug, specs} = instanceInfo
          const fileName = name.replace(placeholders.SLUG, slug) + suffix
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
