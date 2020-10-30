interface TypeHierarchy {
  [key: string]: string | TypeHierarchy | null;
}

export interface UnitDiscription {
  userClass?: string;
  slug?: string;
  highestComponent?: string;
  hierarchy: TypeHierarchy;
}

export interface Units {
  [key: string]: UnitDiscription;
}

export interface BackendIdList {
  [key: string]: string;
}

interface TypeActionIdList {
  [typeName: string]: BackendIdList;
}

interface ActionIdList {
  [unitName: string]: TypeActionIdList;
}

export interface BackendIds {
  stack?: string;
  units: BackendIdList;
  types: BackendIdList;
  actions?: ActionIdList;
}

interface BackendQueryData {
  body: string;
  relationships?: string;
}

interface BackendQueriesData {
  [type: string]: BackendQueryData;
}

export interface BackendData {
  ids: BackendIds;
  queries?: BackendQueriesData;
  info: object;
}

interface NsTemplateInfo {
  name: string;
  version: string;
  dir: string;
}

export interface NsJoinInfo {
  to: string;
  from: string;
}

export interface JoinsData {
  [name: string]: NsJoinInfo;
}

export interface StaticSpec {
  slug: string;
  specs?: any;
}

export interface StaticFileList {
  [name: string]: StaticSpec;
}

export interface StaticsList {
  [name: string]: StaticFileList;
}

export interface NsInfo {
  codeName: string;
  starter: string | undefined;
  template: NsTemplateInfo;
  userClass: string;
  units: Units;
  topUnits: string[];
  static?: StaticsList;
  inputs?: object;
  backend?: BackendData;
  joins?: JoinsData;
}
