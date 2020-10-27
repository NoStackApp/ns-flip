import {NsInfo} from '../constants/types/nsInfo'
import {Schema} from '../constants/types/schema'
import {contextForStandard} from './contextForStandard'
import {loadFileTemplate} from './loadFileTemplate'
import {registerHelpers} from './registerHelpers'
import {registerPartials} from './registerPartials'
import {Configuration} from '../constants/types/configuration'

const fs = require('fs-extra')

// const options = {
//   mode: 0o2775,
// }

// async function createStaticFile (filename: any, path: string) {
//   // const fileTemplate = await loadFileTemplate(filename)
//   // const localPath = filename.replace(standardDir, '')
//   // const newPath = `${appDir}${localPath}`
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
  appDir: string,
  appInfo: NsInfo,
  stackInfo: Schema,
  config: Configuration,
) {
  const staticDirLocalPath = config.dirs.static
  if (!staticDirLocalPath) return
  const staticDir = `${appDir}/${staticDirLocalPath}`

  const staticFiles = appInfo.static
  if (!staticFiles) return
  const fileTypes = Object.keys(staticFiles)

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

  await Promise.all(fileTypes.map(async (fileType: string) => {
    const fileTypeInfo = config.static[fileType]
    if (!fileTypeInfo) throw new Error(`app.yml refers to static type ${fileType} not defined in the template`)
    const {suffix} = fileTypeInfo
    const fileTemplate = await loadFileTemplate(`${templateDir}/static/${fileType}.hbs`)

    const files = staticFiles[fileType]
    await Promise.all(Object.keys(files).map(async fileName => {
      const fileInfo = files[fileName]
      const {slug} = fileInfo
      const fullFilePath = `${staticDir}/${fileType}/${slug}${suffix}`
      const fileText = await fileTemplate(contextForStandard(appInfo, stackInfo, fileName))
      await fs.outputFile(fullFilePath, fileText)
    }
    ))
  }))
}
