import {unitTypes, unitPrefixes} from '../../constants'
import {UnitDiscription} from '../../constants/types/nsInfo'
import {Schema, SpecNameInfo} from '../../constants/types/schema'

const traverse = require('traverse')

import {allCaps} from '../../shared/inflections'
import {newType} from './newType'
// const pluralize = require('pluralize');
import {parseSpecName} from '../../constants/parseSpecName'
import {Configuration} from '../../constants/types/configuration'
// const highestLevel = 'highestLevel';

// const getTypeString = (node: any) => {
//   if (!node) return '0'
//   console.log(`in getTypeString, node = ${JSON.stringify(node)}. typeof node = ${typeof node}`)
//   if (typeof node !== 'string') {
//     return Object.keys(node)[0]
//   }
//   return node
// }

export const newUnit = (
  stack: Schema,
  unitString: string,
  unitInfo: UnitDiscription,
  config: Configuration,
) => {
  // console.log(`in newUnit (unitName=${unitString})`)
  const unitStringInfo: SpecNameInfo = parseSpecName(unitString)
  const unitName: string = unitStringInfo.name

  let unitType = unitTypes.INTERACTIVE
  if (unitStringInfo.prefix === unitPrefixes.SELECTABLE)
    unitType = unitTypes.DATA_SOURCE

  const {hierarchy} = unitInfo
  // const { userClass, hierarchy } = unitInfo;
  if (typeof stack.sources[unitName] !== 'undefined') {
    throw new TypeError(
      `redeclaration of existing unit called '${unitName}'.
        stack.sources[unitName]=${JSON.stringify(stack.sources[unitName])}`
    )
  }

  let unitId = ''
  if (stack.backend) unitId = stack.backend.ids.units[unitName]

  stack.sources[unitName] = {
    const: `SOURCE_${allCaps(unitName)}_ID`,
    id: unitId,
    unitType,
    props: {
      queryBody: '',
      typeRelationships: '',
    },
    name: unitName,
    // depth: 0,
    tree: {},
    selectedTree: {highestLevel: []},
    selections: [],
    constraints: {},
    connections: {},
    selectionRoot: null,
    topSource: null,
  }

  if (!stack.topSource) {
    stack.topSource = unitName
  }

  // console.log(`About to traverse....hierarchy=${JSON.stringify(hierarchy, null, 3)}`)
  // console.log(`the nodes are: ${JSON.stringify(traverse(hierarchy).nodes(), null, 3)}`)
  traverse(hierarchy).map(function () {
    // console.log(`==> in traverse. key=${this.key}  x = ${JSON.stringify(x)}`)

    // 'this' is used in the traverse js package.
    // @ts-ignore
    if (this.isRoot) return

    // @ts-ignore
    const typeString = this.key
    const typeInfo = parseSpecName(typeString)
    let parentType = null

    // @ts-ignore
    const {path} = this
    // console.log(`in traverse.  path = ${JSON.stringify(path)}`)
    if (path.length === 1) {
      stack.sources[unitName].root = typeInfo.name
    } else {
      // console.log(`in traverse.  path[path.length-2] = ${JSON.stringify(path[path.length-1])}`);
      parentType = path[path.length - 2].split('#')[1].split('__')[0]
    }

    // let assnType = globalTypes.associationTypes.MULTIPLE;

    // let typeProperties = null
    // if (properties) {
    //   typeProperties = properties[typeInfo.name]
    // }

    try {
      newType(stack, typeInfo, unitName, parentType, config)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Error(`creation of new type failed for ${JSON.stringify(typeInfo)}`)
    }

    // const properties = properties[typeName];
    // if (properties) {
    //     const
    //     if (properties[typeName].dataType)
    // }
  })
}
