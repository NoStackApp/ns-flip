import {NsJoinInfo} from '../../shared/constants/types/nsInfo'
import {Schema} from '../../shared/constants/types/schema'

// import {associationTypes} from '../../constants'
import {parseSpecName} from '../../shared/constants/parseSpecName'
// import {createActionsForType} from './createActionsForType'
// import {assnTypesForPrefix} from './assnTypesForPrefix'
// const newType = require('newType');
// // const pluralize = require('pluralize');
// const traverse = require('traverse');
// // const highestLevel = 'highestLevel';

// const getTypeString = node => {
//     if (!node) return '0';
//     // console.log(`in getTypeString, node = ${JSON.stringify(node)}. typeof node = ${typeof node}`)
//     if (typeof node !== 'string') {
//         return Object.keys(node)[0];
//     }
//     return node;
// };

export const newJoin = (
  schema: Schema, joinString: string, joinInfo: NsJoinInfo
) => {
  // console.log(`in newJoin (joinName=${joinString})`)
  // console.log(`in newJoin (joinInfo=${JSON.stringify(joinInfo)})`)
  // console.log(`in newJoin (stack=${JSON.stringify(stack)})`);
  const joinStringInfo = parseSpecName(joinString)
  const joinName = joinStringInfo.name
  const typePrefix = joinStringInfo.prefix

  if (!typePrefix) {
    throw new Error(`no specified type in the join ${joinString} in the 'app.yml' file`)
  }

  // let assnType = associationTypes.SELECTABLE // default
  // assnType = assnTypesForPrefix[typePrefix]
  const assnType = typePrefix

  const fromInfo = parseSpecName(joinInfo.from)
  const toInfo = parseSpecName(joinInfo.to)

  const fromUnit = fromInfo.detail
  const fromType = fromInfo.name
  const toUnit = toInfo.detail
  const toType = toInfo.name

  const fromUnitInfo = schema.sources[fromUnit]
  if (fromUnitInfo &&
    !Object.prototype.hasOwnProperty.call(fromUnitInfo, 'joins')
  )
    fromUnitInfo.joins = {}
  if (fromUnitInfo && !fromUnitInfo.joins)
    fromUnitInfo.joins = {}

  if (!fromUnitInfo.joins) throw new Error(`joins is undefined for unit ${fromUnit}.
    This should not happen.  Please open an issue if you see this. `)
  fromUnitInfo.joins[joinName] = {
    fromUnit,
    fromType,
    toUnit,
    toType,
    assnType,
  }

  const parentTypeSourceInfo = schema.types[fromType].sources[fromUnit]
  // const parentTypeSubTree = stack.sources[unit].tree[parentType];

  if (!parentTypeSourceInfo.joins)
    parentTypeSourceInfo.joins = {
      [joinName]: {
        fromType,
        toType,
        fromUnit,
        toUnit,
        assnType,
      },
    }

  parentTypeSourceInfo.joins[joinName] = {
    fromUnit,
    toUnit,
    toType,
    fromType,
    assnType,
  }

  // ACTION GENERATION SUSPENDED...
  // const parentAssnType = parentTypeSourceInfo.assnType

  // schema = createActionsForType(
  //   parentAssnType,
  //   schema,
  //   joinName,
  //   toUnit,
  //   null,
  //   assnType,
  //   fromType,
  //   true,
  //   fromUnit,
  // )

  // // create actions

  //
  // let updateActionType = globalTypes.actionTypes.UPDATE_INSTANCE;
  // if (assnType === globalTypes.associationTypes.SELECTABLE)
  //     updateActionType = globalTypes.actionTypes.UPDATE_INSTANCE_ASSN;
  //
  // stack.actions[updateActionType][`${fromUnit}__${joinName}_update`] = {
  //     const: `UPDATE_${allCaps(joinName)}_FOR_${allCaps(fromUnit)}_ACTION_ID`,
  //     actionName: `update ${joinName} for ${fromUnit}`,
  //     userClass: stack.sources[fromType].owner,
  //     actionType: updateActionType,
  //     parentType: fromType,
  //     type: toType,
  //     source: toUnit,
  //     parentSource: fromUnit,
  //     isJoin: true,
  // };
  //
  // stack.actions[actionType][`${unit}__${name}_${actionVerb}`] = {
  //     const: `CREATE_${allCaps(name)}_FOR_${allCaps(unit)}_ACTION_ID`,
  //     actionName: `${actionVerb} ${name} for ${unit}`,
  //     userClass: stack.sources[unit].owner,
  //     actionType,
  //     type: name,
  //     parentType,
  //     source: unit,
  //     isJoin,
  // };
  //
  //
  // createActionsForType(assnType, stack, toType, toUnit, sourceUnit, assnType, parentType, false);

  // console.log(`in newJoin (stack for source =${JSON.stringify(stack.sources[fromUnit])})`);

  return schema
}
