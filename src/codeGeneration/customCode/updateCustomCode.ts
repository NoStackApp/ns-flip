import {CustomCodeByFile, CustomCodeCollection, CustomCodeRepository} from '../../shared/constants/types/custom'
import {fs, updateCustomCodeForFile} from './updateCustomCodeForFile'
import {Configuration} from '../../shared/constants/types/configuration'

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

export async function updateCustomCode(
  customCode: CustomCodeRepository,
  rootDir: string,
  config: Configuration,
) {
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
        await updateCustomCodeForFile(filePath, customCodeByFile[relativePath], config)
      } else {
        // eslint-disable-next-line no-console
        console.log(`***WARNING*** the file ${relativePath} does not exist ` +
                    'but has custom code in your current version.  That could be caused ' +
          'by changing your settings if you removed something that should have been' +
          'generated to that file.  Another possibility is that ' +
          'the file was moved to a wrong location.  That problem would have been caught by ' +
          'running `check` before running `generate`.')
        // throw new Error(`can't find file for ${filePath}`)
      }
    } catch (error) {
      throw new Error(`couldn't update ${filePath}. rootDir=${rootDir}.`)
    }
  }))
}
