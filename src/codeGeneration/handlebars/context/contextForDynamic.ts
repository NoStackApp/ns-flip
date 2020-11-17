import {associationTypes, BoilerPlateInfoType, dataTypes, nodeTypes} from '../../../constants'
import {NsInfo} from '../../../constants/types/nsInfo'
import {Schema, TreeTypeChildrenList} from '../../../constants/types/schema'
import {
  allCaps,
  pluralLowercaseName,
  pluralName,
  queryForSource,
  relationshipsForSource,
  singularName,
} from '../../../shared/inflections'
import {componentName} from '../../fileGeneration/dynamicComponents/componentName'
import {Configuration} from '../../../constants/types/configuration'

const Handlebars = require('handlebars')

const fileInfoString = Handlebars.compile('unit: {{unitName}}, comp: {{component}}')

export const contextForDynamic = async (
  type: string,
  unit: string,
  nsInfo: NsInfo,
  stackInfo: Schema,
  boilerPlateInfo: BoilerPlateInfoType,
  config: Configuration,
) => {
  // stack data
  const typesInfo = stackInfo.types
  const sourcesInfo = stackInfo.sources
  const unitInfo = sourcesInfo[unit]
  const typeUnitInfo = typesInfo[type].sources[unit]
  const {parentType} = typeUnitInfo
  const children = unitInfo.selectedTree[type]
  const connectedUnit: string = unitInfo.connections[type]
  const connectedUnitInfo = sourcesInfo[connectedUnit]

  // function getChildren(type: string, unit: string, appInfo: AppInfo) {
  //   return Object.keys(appInfo.units[unit].hierarchy)
  // }
  // const children = getChildren(type, unit, appInfo)

  const {componentTypes} = config
  if (!componentTypes) throw new Error('No component types found for the template.')
  const componentTypeSpec = componentTypes[boilerPlateInfo.componentType]
  if (!componentTypeSpec) throw new Error(`component type ${type} is used in the template,
   but is not found in the config file in 'componentTypes'.`)
  const names = {
    singular: singularName(type),
    singularLowercase: type,
    plural: pluralName(type),
    pluralLowercase: pluralLowercaseName(type),
    parent: parentType,
    component: componentName(type, componentTypeSpec),
    source: {
      name: unit,
      allCaps: allCaps(unit),
      constant: `SOURCE_${allCaps(unit)}_ID`,
      typeSpecifier: allCaps(`${type}_for_${unit}`),
      relationships: relationshipsForSource(unit),
      query: queryForSource(unit),
    },
  }

  // content
  const fileInfo = fileInfoString({
    unitName: unit,
    component: names.component,
  })

  let connectedChildren: TreeTypeChildrenList = {}
  if (connectedUnit) {
    connectedChildren = {
      ...connectedUnitInfo.tree[type],
    }
  }

  // const tempDetails = `unit: ${unit}, comp: ${names.component}, loc:`
  // Handlebars.registerHelper('tempDetails', function (unit: string, compName: string) {
  //   const tempDetails = `unit: ${unit}, comp: ${compName}, loc:`
  //   return new Handlebars.SafeString(tempDetails)
  // })

  // data about children

  const childrenInfoAll = children.map(child => {
    const childInfo = typesInfo[child]
    const assnInfo = childInfo.sources[unit]
    if (assnInfo.assnType !== associationTypes.SINGLE_REQUIRED)
      return {
        nonProperty: true,
        childComponent: pluralName(child),
        childPlural: pluralLowercaseName(child),
        childAllCaps: allCaps(child),
        childSingular: singularName(child),
        child,
        type,
        pluralChild: pluralLowercaseName(child),
      }
    return {
      nonProperty: false,
      childComponent: singularName(child),
      childAllCaps: allCaps(child),
      child,
      type,
    }
  })

  const connectedChildrenInfo =
    Object.keys(connectedChildren).map((child: string) => {
      const singularConnected = singularName(connectedUnit)
      if (connectedChildren[child] !== associationTypes.SINGLE_REQUIRED)
        return {childComponent: pluralName(child), singularConnected, type}
      return {childComponent: singularName(child), singularConnected, type}
    })

  const singleChildrenInfo = children.map(child => {
    const childInfo = typesInfo[child]
    const assnInfo = childInfo.sources[unit]
    if (assnInfo.assnType === associationTypes.SINGLE_REQUIRED)
      return {
        property: true,
        singularChild: singularName(child),
        childAllCaps: allCaps(child),
        sourceAllCaps: allCaps(unit),
        singularParent: singularName(type),
      }
  }).filter(Boolean)

  /*
      IMPORTS_SECTION: imports({
      boilerPlateInfo,
      component,
      instance,
      tempDetails,
      names,
      childrenImportList,
      typeSpecifier,
      childrenTypeList,
      actionIdsForSingleChildren,
      typeIdsForSingleChildren,
    }),
   */

  console.log(`boilerPlateInfo = ${JSON.stringify(boilerPlateInfo)}`)
  const childrenInfo = {
    all: childrenInfoAll,
    connected: connectedChildrenInfo,
    single: singleChildrenInfo,
  }

  return {
    nodeTypes,
    dataTypes,
    stackInfo,
    boilerPlateInfo,
    names,
    childrenInfo,
    fileInfo,
    nsInfo,
    config,
  }
}
