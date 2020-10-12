/*
  Custom Code Object
 */

export interface CompInfo {
  path: string;
  [location: string]: string;
}

export interface UnitInfo {
  [comp: string]: CompInfo;
}

export interface CustomCodeCollection {
  [unit: string]: UnitInfo;
}

export interface CustomCodeRepository {
  addedCode: CustomCodeCollection;
  replacedCode: CustomCodeCollection;
  removedCode: CustomCodeCollection;
}

export interface SnippitList {
  [location: string]: string;
}

export interface FileCustomCode {
  unit: string;
  comp: string;
  addedCode: SnippitList;
  replacedCode: SnippitList;
  removedCode: SnippitList;
}

export interface CustomCodeByFile {
  [path: string]: FileCustomCode;
}
