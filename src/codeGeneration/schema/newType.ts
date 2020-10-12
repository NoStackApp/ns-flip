import {dataTypes, nodeTypes, typePrefixes, constraintTypes} from '../../constants'
import {Configuration, Schema, SpecNameInfo} from '../../constants/types/schema'
const inflection = require('inflection')
// const createActionsForType = require('./createActionsForType')
// import {assnTypesForPrefix} from './assnTypesForPrefix'

function handleParentOfAssn(
  schema: Schema,
  unit: string,
  parentType: string,
  name: string,
  assnType: string,
  // sourceUnit: string,
) {
  if (!schema.sources[unit].tree[parentType]) {
    throw new Error(`In the declaration of new type ${name} in the unit ${unit}:
  the parent ${parentType} is not already in the source`
    )
  }

  const parentTypeSourceInfo = schema.types[parentType].sources[unit]
  const parentTypeSubTree = schema.sources[unit].tree[parentType]

  // const parentAssnType = parentTypeSourceInfo.assnType

  // console.log(`^^ for type ${name} in ${unit}, the assnType is ${assnType}, and the parent '${parentType}'`)

  parentTypeSubTree[name] = assnType
  parentTypeSourceInfo.children.push(name)

  // createActionsForType(
  //   parentAssnType,
  //   stack,
  //   name,
  //   unit,
  //   sourceUnit,
  //   assnType,
  //   parentType,
  //   false,
  //   unit
  // )
}

export const newType = (
  schema: Schema,
  typeInfo: SpecNameInfo,
  unitName: string,
  parentType: string,
  config: Configuration,
) => {
  const typeName = typeInfo.name
  const typePrefix = typeInfo.prefix
  const assnType = typePrefix

  const dataType = dataTypes.STRING
  const {dataFunctionTypes} = config

  // if (typeProperties && typeProperties.dataType) {
  //   dataType = typeProperties.dataType
  // }

  // if (dataType === dataTypes.BOOLEAN ||
  //       dataType === dataTypes.NUMBER) {
  //   assnType = associationTypes.SINGLE_REQUIRED // assumed for those types
  // }

  // console.log(`in traverse, typeName=${typeName}, assnType=${assnType}`)
  if (assnType === 'undefined') {
    throw new Error(
      `bad prefix '${typePrefix}' for type '${typeName}' in unit ${unitName}`
    )
  }

  let sourceUnit
  // if (assnType === associationTypes.SELECTABLE ||
  //       assnType === associationTypes.VIEWABLE) {
  if (dataFunctionTypes[assnType].requiresSource) {
    sourceUnit = typeInfo.detail

    // if (stack.sources[sourceUnit] == null) {
    //     throwError(
    //         `You declared a new type '${typeName}'  of assnType 'selectable' with a nonexistent
    //     selection source unit '${sourceUnit}'. You must use a unit that is already declared`
    //     );
    // }
  }

  if (typePrefix === typePrefixes.CONSTRAIN) {
    const constraintType = constraintTypes.ID
    // TODO: add .VALUE in properties after value is supported.

    let constraintValue = 'undefined'
    if (parentType === null) {
      constraintValue = 'current' + inflection.capitalize(typeName)
    }
    // TODO: add check for properties for constraintValue.

    schema.sources[unitName].constraints[unitName] = {
      constraintType,
      typeName,
      constraintValue,
    }
  }

  // by default, a constrained type is not selected, and others are.
  if (typePrefix !== typePrefixes.CONSTRAIN) {
    schema.sources[unitName].selections.push(typeName)
  }

  // const ROOT_NODE = '__Root__';
  // console.log(`in newType (parentType=${parentType}, name=${typeName}, unit=${unitName}, typePrefix=${typePrefix})`)

  if (typePrefix === 'create' && typeof schema.types[typeName] !== 'undefined') {
    throw new Error(
      `redeclaration of existing creatable type called '${typeName}' in unit '${unitName}'`
    )
  }

  if (parentType) {
    // if (Object.keys(stack.sources[unit].tree).length !== 0) {
    if (!schema.types[parentType]) {
      throw new Error(
        `You declared a new unit '${typeName}' for a nonexistent parentType '${parentType}'`
      )
    }
    if (schema.types[parentType].sources[unitName] === null) {
      throw new Error(
        `You declared a new type '${typeName}' for a parentType '${parentType}'
            that does not exist in the unit '${unitName}'`
      )
    }
    // }
  }

  // let treeDepth = stack.sources[unit].depth;
  // let depth = 1;

  // if (parentType !== ROOT_NODE && stack.types[parentType]) {
  //     if (stack.types[parentType].sources[unit]) {
  //         const parentDepth = stack.types[parentType].sources[unit].depth;
  //         depth = parentDepth + 1;
  //     } else {
  //         depth = 2;
  //     }
  // }
  // if (depth > treeDepth) stack.sources[unit].depth = depth;

  let nodeType = nodeTypes.NONROOT
  // if (assnType === associationTypes.SINGLE_REQUIRED)
  //   nodeType = nodeTypes.PROPERTY
  // if (assnType === associationTypes.SELECTABLE)
  //   nodeType = nodeTypes.SELECTABLE
  // if (!parentType) nodeType = nodeTypes.ROOT
  if (dataFunctionTypes[assnType].nodeType)
    nodeType = dataFunctionTypes[assnType].nodeType

  // const finalParentType = parentType !== ROOT_NODE ? parentType : null;

  if (schema.types[typeName]) {
    schema.types[typeName].sources[unitName] = {
      // id: schema.sources[unitName].id,
      parentType,
      nodeType,
      assnType,
      children: [],
    }
  } else {
    schema.types[typeName] = {
      dataType,
      name: typeName,
      sources: {
        [unitName]: {
          // id: schema.sources[unitName].id,
          parentType,
          nodeType,
          assnType,
          children: [],
          sourceUnit,
        },
      },
    }
  }

  // if (assnType !== associationTypes.SINGLE_REQUIRED) {
  //   schema.types[typeName].sources[unitName].plural = inflection.camelize(pluralize(typeName), false)
  // }

  schema.sources[unitName].tree[typeName] = {}

  // let updateActionType = actionTypes.UPDATE_INSTANCE;
  // if (assnType === associationTypes.SELECTABLE)
  //     updateActionType = actionTypes.UPDATE_INSTANCE_ASSN;

  if (!parentType) {
    // TODO: make this work with no parent
    // createActionsForType(null, stack, typeName, unitName, sourceUnit, assnType, parentType);
    return
  }

  handleParentOfAssn(
    schema,
    unitName,
    parentType,
    typeName,
    assnType,
    // sourceUnit
  )
  // stack.actions[updateActionType][`${unitName}__${typeName}_update`] = {
  //     const: `UPDATE_${allCaps(typeName)}_FOR_${allCaps(unitName)}_ACTION_ID`,
  //     actionName: `update ${typeName} for ${unitName}`,
  //     userClass: stack.sources[unitName].owner,
  //     actionType: updateActionType,
  //     parentType,
  //     type: typeName,
  //     source: unitName,
  //     isJoin: false,
  // };
}
