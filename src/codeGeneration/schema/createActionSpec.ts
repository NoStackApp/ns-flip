// const globalTypes = require('../globalTypes')
// const allCaps = require('../allCaps')
//
// const getActionType = (defaultVerb, assnType, parentAssnType) => {
//   let defaultActionType = globalTypes.actionTypes.DELETE_INSTANCE
//   let selectableActionType = globalTypes.actionTypes.DELETE_INSTANCE_ASSN
//
//   if (defaultVerb === 'update') {
//     defaultActionType = globalTypes.actionTypes.UPDATE_INSTANCE
//     selectableActionType = globalTypes.actionTypes.UPDATE_INSTANCE_ASSN
//   }
//
//   if (defaultVerb === 'create') {
//     if (parentAssnType === globalTypes.associationTypes.SELECTABLE ||
//             parentAssnType === globalTypes.associationTypes.VIEWABLE)
//       return globalTypes.actionTypes.CREATE_INSTANCE_WITH_UNOWNED_PARENT
//
//     defaultActionType = globalTypes.actionTypes.CREATE_INSTANCE
//     selectableActionType = globalTypes.actionTypes.ADD_INSTANCE_ASSN
//   }
//
//   if (assnType === globalTypes.associationTypes.SELECTABLE) {
//     return selectableActionType
//   }
//
//   return defaultActionType
// }
//
// const getActionVerb = (defaultVerb, assnType) => {
//   if (defaultVerb !== 'create') return defaultVerb
//   if (assnType === globalTypes.associationTypes.SELECTABLE) return 'add'
//   return defaultVerb
// }
//
// const actionSpec = (actionType, actionVerb, unit, owner, parentType, name, isJoin, parentUnit) => {
//   return {
//     const: `${allCaps(actionVerb)}_${allCaps(name)}_FOR_${allCaps(unit)}_ACTION_ID`,
//     actionName: `${actionVerb} ${name} for ${unit}`,
//     userClass: owner,
//     actionType,
//     type: name,
//     parentType,
//     parentUnit,
//     source: unit,
//     isJoin,
//   }
// }
//
// export const createActionSpec = (
//   defaultVerb,
//   stack,
//   unit,
//   childType,
//   parentAssnType,
//   assnType,
//   parentType,
//   isJoin,
//   parentUnit
// ) => {
//   const owner = stack.sources[unit].owner
//   const actionType = getActionType(defaultVerb, assnType, parentAssnType)
//   const actionVerb = getActionVerb(defaultVerb, assnType)
//   const actionKey = `${unit}__${childType}_${actionVerb}`
//
//   stack.actions[actionType][actionKey] = actionSpec(
//     actionType,
//     actionVerb,
//     unit,
//     owner,
//     parentType,
//     childType,
//     isJoin,
//     parentUnit
//   )
//
//   return stack
// }
