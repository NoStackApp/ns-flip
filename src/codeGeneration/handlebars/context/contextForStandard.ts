import {dataTypes, nodeTypes, magicStrings} from '../../../shared/constants'
import {NsInfo, BackendIdList} from '../../../shared/constants/types/nsInfo'
import {Schema} from '../../../shared/constants/types/schema'
import {
  allCaps,
  pluralLowercaseName,
  pluralName,
  singularName,
} from '../../../shared/inflections'
import {createGeneralInfo} from './createGeneralInfo'
import {Configuration} from '../../../shared/constants/types/configuration'

const Handlebars = require('handlebars')

const fileInfoString = Handlebars.compile('unit: {{unitName}}, comp: {{component}}')

export const contextForStandard = async (
  nsInfo: NsInfo,
  stackInfo: Schema,
  component: string,
  codeDir: string,
  config: Configuration,
) => {
  // stack data
  const unit = magicStrings.STANDARD_UNIT

  const names = {
    singular: singularName(component),
    singularLowercase: component,
    plural: pluralName(component),
    pluralLowercase: pluralLowercaseName(component),
    component,
  }

  const sourceList = Object.keys(stackInfo.sources).map(sourceName => {
    const currentSourceInfo = stackInfo.sources[sourceName]
    return {
      sourceConst: currentSourceInfo.const,
      sourceId: currentSourceInfo.id,
    }
  })

  let typeIds: BackendIdList
  if (nsInfo.backend && nsInfo.backend.ids && nsInfo.backend.ids.types)
    typeIds = nsInfo.backend.ids.types
  const typesText = Object.keys(stackInfo.types).map(typeName => {
    return {
      typeConst: `TYPE_${allCaps(typeName)}_ID`,
      typeId: typeIds ? typeIds[typeName] : undefined,
    }
  })

  // previously hard-coded: const topUnit = singularName(appInfo.topUnits[0])
  const userClass = nsInfo.userClass
  const userTypeId = `TYPE_${allCaps(userClass)}_ID`

  // content
  const fileInfo = fileInfoString({
    unitName: unit,
    component: names.component,
  })

  // const tempDetails = fileInfoString({
  //   unitName: unit,
  //   component: names.component,
  // }) + ', loc:'

  const general = await createGeneralInfo(nsInfo, codeDir)

  return {
    nodeTypes,
    dataTypes,
    names,
    fileInfo,
    // topUnit,
    userTypeId,
    appName: nsInfo.codeName,
    sources: sourceList,
    types: typesText,
    actionTypes: stackInfo.context?.actionTypes,
    stackInfo,
    nsInfo,
    general,
    config,
  }
}
