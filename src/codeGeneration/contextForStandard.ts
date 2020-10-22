import {dataTypes, nodeTypes} from '../constants'
import {NsInfo, BackendIdList} from '../constants/types/nsInfo'
import {Schema} from '../constants/types/schema'
import {
  allCaps,
  pluralLowercaseName,
  pluralName,
  singularName,
} from '../shared/inflections'

const Handlebars = require('handlebars')

const fileInfoString = Handlebars.compile('unit: {{unitName}}, comp: {{component}}')

export const contextForStandard = (
  appInfo: NsInfo,
  stackInfo: Schema,
  component: string
) => {
  // stack data
  const unit = 'general'

  const names = {
    singular: singularName(component),
    singularLowercase: component,
    plural: pluralName(component),
    pluralLowercase: pluralLowercaseName(component),
    component,
  }

  const actionTypeList = Object.keys(stackInfo.actions).map(actionType => {
    const actionsForCurrentType = stackInfo.actions[actionType]
    return {
      actionType,
      actions: Object.keys(actionsForCurrentType).map(action => {
        const currentActionInfo = actionsForCurrentType[action]
        return {
          actionConst: currentActionInfo.const,
          actionId: currentActionInfo.id,
        }
      }),
    }
  })

  const sourceList = Object.keys(stackInfo.sources).map(sourceName => {
    const currentSourceInfo = stackInfo.sources[sourceName]
    return {
      sourceConst: currentSourceInfo.const,
      sourceId: currentSourceInfo.id,
    }
  })

  let typeIds: BackendIdList
  if (appInfo.backend && appInfo.backend.ids && appInfo.backend.ids.types)
    typeIds = appInfo.backend.ids.types
  const typesText = Object.keys(stackInfo.types).map(typeName => {
    return {
      typeConst: `TYPE_${allCaps(typeName)}_ID`,
      typeId: typeIds ? typeIds[typeName] : undefined,
    }
  })

  // previously hard-coded: const topUnit = singularName(appInfo.topUnits[0])
  const userClass = appInfo.userClass
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

  return {
    nodeTypes,
    dataTypes,
    names,
    fileInfo,
    // topUnit,
    userTypeId,
    appName: appInfo.codeName,
    sources: sourceList,
    types: typesText,
    actionTypes: actionTypeList,
    stackInfo,
    appInfo,
  }
}
