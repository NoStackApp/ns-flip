// import {associationTypes} from '../../constants'
// const createActionSpec = require('./createActionSpec')
//
// // TODO: make sure that creation works when there's no parent.  If need be, create
// // a new action for that.
//
// export function createActionsForType(
//   parentAssnType,
//   stack,
//   name,
//   unit,
//   sourceUnit,
//   assnType,
//   parentType,
//   isJoin,
//   parentUnit
// ) {
//   // const owner = stack.sources[unit];
//   //
//   if (parentAssnType === associationTypes.SELECTABLE ||
//         parentAssnType === associationTypes.VIEWABLE) {
//     stack.types[name].sources[unit].sourceUnit = sourceUnit
//   }
//
//   stack = createActionSpec(
//     'update',
//     stack,
//     unit,
//     name,
//     parentAssnType,
//     assnType,
//     parentType,
//     isJoin,
//     parentUnit
//   )
//
//   stack = createActionSpec(
//     'create',
//     stack,
//     unit,
//     name,
//     parentAssnType,
//     assnType,
//     parentType,
//     isJoin,
//     parentUnit
//   )
//
//   stack = createActionSpec(
//     'delete',
//     stack,
//     unit,
//     name,
//     parentAssnType,
//     assnType,
//     parentType,
//     isJoin,
//     parentUnit
//   )
//
//   // // let actionType = getActionType('create', assnType, parentAssnType);
//   // // let actionVerb = getActionVerb('create', assnType);
//   // let actionKey = `${unit}__${name}_${actionVerb}`;
//   //
//   // stack.actions[actionType][actionKey] = getActionSpec(
//   //     'create',
//   //     unit,
//   //     name,
//   //     parentAssnType,
//   //     assnType,
//   //     owner,
//   //     parentType,
//   //     isJoin
//   // );
//   // // console.log(`actionType=${actionType}`);
//   //
//   // // stack.actions[actionType][`${unit}__${name}_${actionVerb}`] = {
//   // //     const: `CREATE_${allCaps(name)}_FOR_${allCaps(unit)}_ACTION_ID`,
//   // //     actionName: `${actionVerb} ${name} for ${unit}`,
//   // //     userClass: stack.sources[unit].owner,
//   // //     actionType,
//   // //     type: name,
//   // //     parentType,
//   // //     source: unit,
//   // //     isJoin,
//   // // };
//   //
//   // actionType = globalTypes.actionTypes.DELETE_INSTANCE;
//   // actionVerb = 'delete';
//   // actionKey = `${unit}__${name}_${actionVerb}`;
//   //
//   // if (assnType === globalTypes.associationTypes.SELECTABLE) {
//   //     actionType = globalTypes.actionTypes.DELETE_INSTANCE_ASSN;
//   // }
//   //
//   // stack.actions[actionType][actionKey] = actionSpec(
//   //     actionType,
//   //     actionVerb,
//   //     unit,
//   //     owner,
//   //     parentType,
//   //     isJoin
//   // );
//   //
//   // // stack.actions[actionType][`${unit}__${name}_delete`] = {
//   // //     const: `DELETE_${allCaps(name)}_FOR_${allCaps(unit)}_ACTION_ID`,
//   // //     actionName: `delete ${name} for ${unit}`,
//   // //     userClass: stack.sources[unit].owner,
//   // //     actionType,
//   // //     type: name,
//   // //     parentType,
//   // //     source: unit,
//   // //     isJoin,
//   // // }
//
//   return stack
// }
//
