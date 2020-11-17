import {BackendData} from './nsInfo'

export interface UserInfo {
  name: string;
  stack: string;
  stackId: string;
  password: string;
  refreshToken: string;
  accessToken: string;
  email: string;
  id: string;
  licenseId: string;
}

// export interface CreateOptions {
//   parent: string;
//   value: string;
//   level: string;
//   userInfo: UserInfo;
// }

interface PropsInfo {
  queryBody: string;
  typeRelationships: string;
}

export interface TreeTypeChildrenList {
  [type: string]: string;
}

interface SelectedTreeList {
  highestLevel: string[];
  [type: string]: string[];
}

interface TreeTypeList {
  [type: string]: TreeTypeChildrenList;
}

interface ConnectedList {
  [type: string]: string;
}

interface ConstraintInfo {
  constraintType: string;
  typeName: string;
  constraintValue: string;
}

interface ConstraintsSet {
  [type: string]: ConstraintInfo;
}

interface JoinInfo {
  fromUnit: string;
  fromType: string;
  toUnit: string;
  toType: string;
  assnType: string;
  joinAssnId?: string;
}

interface JoinsList {
  [join: string]: JoinInfo;
}

export interface SourceInfo {
  id?: string;
  const: string;
  unitType: string;
  props: PropsInfo;
  name: string;
  depth?: number;
  tree: TreeTypeList;
  selections: string[];
  selectedTree: SelectedTreeList;
  constraints: ConstraintsSet;
  connections: ConnectedList;
  owner?: string;
  root?: string;
  selectionRoot: string | null;
  joins?: JoinsList;
  topSource: string | null;
}

/*
    "user": {
      "name": "user",
      "id": "9f025291-ff2b-4ae7-9e89-d9a87ea6a080",
      "samples": {
        "tstNoStackMod1": {
          "id": "546decf9-6d66-4dc6-b3c6-f2451d427bb4",
          "suffix": "Mod",
          "owner": "tstNoStackMod1"
        },
 */
export interface UserClassInfo {
  name: string;
  // id: string;
  topSource: string;
  // samples: object;
}

export interface UserClasses {
  [userClassName: string]: UserClassInfo;
}

export interface Sources {
  [sourceName: string]: SourceInfo;
}

export interface TypeSourceInfo {
  assnType: string;
  nodeType: string;
  parentType: string;
  children: string[];
  joins?: JoinsList;
  sourceUnit?: string;
}

export interface TypeSources {
  [sourceName: string]: TypeSourceInfo;

}

export interface TypeInfo {
  // const: string;
  name: string;
  dataType: string;
  // plural: string;
  sources: TypeSources;
  // id: string;
}

export interface Types {
  [typeName: string]: TypeInfo;
}

export interface ActionInfo {
  const: string;
  actionName: string;
  userClass: string;
  actionType: string;
  type?: string;
  parentType?: string;
  source?: string;
  id: string;
}

export interface Actions {
  [actionKey: string]: ActionInfo;
}

export interface ActionsByActionType {
  [actionType: string]: Actions;
}

// interface ActionTypeInfo {
//
// }
//
// interface ActionTypes {
//   [key: number]: ActionTypeInfo;
// }
//

interface ActionContextInfo {
  actionId: string;
  actionConst: string;
}

interface ActionContextList {
  [actionId: string]: ActionContextInfo;
}

interface ActionTypeContextInfo {
  actionType: string;
  actions: ActionContextList;
}

interface ActionTypesContextInfo {
  [actionType: string]: ActionTypeContextInfo;
}

export interface ContextSupport {
  actionTypes: ActionTypesContextInfo;
}

export interface Schema {
  topSource: string;
  userClasses: UserClasses;
  sources: Sources;
  types: Types;
  actions: ActionsByActionType;
  backend?: BackendData;
  context?: ContextSupport;
}

// export interface Inputs {
//   [nameList: string]: string[];
// }

// following is a recursive Directory type.  A directory can contain
// either files or arrays of files/subdirectories.
export interface Directory {
  [key: string]: string | Directory;
}

export interface SpecNameInfo {
  name: string;
  detail: string;
  prefix: string;
}
