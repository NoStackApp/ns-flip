export const liveServer = 'https://api.matchlynx.com/graphql'
// export const liveServer = 'https://api.matchlynx.com/graphql'
// export const liveServer = 'https://qq0we0b5s4.execute-api.us-east-1.amazonaws.com/dev/graphql'

export const associationTypes = {
  MULTIPLE: 'multiple',
  SINGLE_REQUIRED: 'singleRequired',
  SELECTABLE: 'selectable',
  VIEWABLE: 'viewable',
}

export const dataTypes = {
  STRING: 'string',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  GROUPING: 'grouping',
}

export const nodeTypes = {
  NONROOT: 'nonRoot',
  ROOT: 'Root',
  PROPERTY: 'Property',
  SELECTABLE: 'selectable',
}

// export const formTypes = {
//   CREATION: 'creation',
//   SINGLE_INSTANCE: 'single',
//   LIST: 'list',
//   SELECTION: 'selection',
// }

export const unitTypes = {
  INTERACTIVE: 'interactive',
  DATA_SOURCE: 'dataSource',
}

export interface BoilerPlateInfoType {
  componentType: string;
  dataType: string;
  nodeType: string;
}

// export const boilerPlateTypes = {
//   CREATION_ROOT: `${formTypes.CREATION}${dataTypes.STRING}${nodeTypes.ROOT}`,
//   CREATION_NON_ROOT: `${formTypes.CREATION}${dataTypes.STRING}${nodeTypes.NONROOT}`,
//   CREATION_SELECTABLE: `${formTypes.CREATION}${dataTypes.STRING}${nodeTypes.SELECTABLE}`,
//   CREATION_ROOT_GROUPING: `${formTypes.CREATION}${dataTypes.GROUPING}${nodeTypes.ROOT}`,
//   CREATION_NON_ROOT_GROUPING: `${formTypes.CREATION}${dataTypes.GROUPING}${nodeTypes.NONROOT}`,
//   MULTIPLE_NON_ROOT: `${formTypes.LIST}${dataTypes.STRING}${nodeTypes.NONROOT}`,
//   MULTIPLE_SELECTABLE: `${formTypes.LIST}${dataTypes.STRING}${nodeTypes.SELECTABLE}`,
//   MULTIPLE_ROOT: `${formTypes.LIST}${dataTypes.STRING}${nodeTypes.ROOT}`,
//   MULTIPLE_NON_ROOT_GROUPING: `${formTypes.LIST}${dataTypes.GROUPING}${nodeTypes.NONROOT}`,
//   MULTIPLE_ROOT_GROUPING: `${formTypes.LIST}${dataTypes.GROUPING}${nodeTypes.ROOT}`,
//   SINGLE_NON_ROOT: `${formTypes.SINGLE_INSTANCE}${dataTypes.STRING}${nodeTypes.NONROOT}`,
//   SINGLE_SELECTABLE: `${formTypes.SINGLE_INSTANCE}${dataTypes.STRING}${nodeTypes.SELECTABLE}`,
//   SINGLE_ROOT: `${formTypes.SINGLE_INSTANCE}${dataTypes.STRING}${nodeTypes.ROOT}`,
//   SINGLE_NON_ROOT_GROUPING: `${formTypes.SINGLE_INSTANCE}${dataTypes.GROUPING}${nodeTypes.NONROOT}`,
//   SINGLE_ROOT_GROUPING: `${formTypes.SINGLE_INSTANCE}${dataTypes.GROUPING}${nodeTypes.ROOT}`,
//   SINGLE_BOOLEAN: `${formTypes.SINGLE_INSTANCE}${dataTypes.BOOLEAN}${nodeTypes.PROPERTY}`,
//   SINGLE_NUMBER: `${formTypes.SINGLE_INSTANCE}${dataTypes.NUMBER}${nodeTypes.PROPERTY}`,
//   SINGLE_PROPERTY: `${formTypes.SINGLE_INSTANCE}${dataTypes.STRING}${nodeTypes.PROPERTY}`,
//   SELECTION: `${formTypes.SELECTION}${dataTypes.STRING}${nodeTypes.SELECTABLE}`,
// }

// export const boilerPlates = {
//   [boilerPlateTypes.CREATION_ROOT]: 'genericCreationFormRoot',
//   [boilerPlateTypes.CREATION_NON_ROOT]: 'genericCreationFormNonRoot',
//   [boilerPlateTypes.CREATION_SELECTABLE]: 'genericCreationFormSelectable',
//   [boilerPlateTypes.CREATION_ROOT_GROUPING]: 'genericCreationFormRootGrouping',
//   [boilerPlateTypes.CREATION_NON_ROOT_GROUPING]: 'genericCreationFormNonRootGrouping',
//   [boilerPlateTypes.MULTIPLE_NON_ROOT]: 'genericMultipleNonRoot',
//   [boilerPlateTypes.MULTIPLE_SELECTABLE]: 'genericMultipleSelectable',
//   [boilerPlateTypes.MULTIPLE_ROOT]: 'genericMultipleRoot',
//   [boilerPlateTypes.SINGLE_ROOT]: 'genericSingle',
//   [boilerPlateTypes.SINGLE_NON_ROOT]: 'genericSingleNonRoot',
//   [boilerPlateTypes.SINGLE_SELECTABLE]: 'genericSingleSelectable',
//   [boilerPlateTypes.MULTIPLE_NON_ROOT_GROUPING]: 'genericMultipleNonRootGrouping',
//   [boilerPlateTypes.MULTIPLE_ROOT_GROUPING]: 'genericMultipleRootGrouping',
//   [boilerPlateTypes.SINGLE_ROOT_GROUPING]: 'genericSingleRootGrouping',
//   [boilerPlateTypes.SINGLE_NON_ROOT_GROUPING]: 'genericSingleNonRootGrouping',
//   [boilerPlateTypes.SINGLE_PROPERTY]: 'genericSingleProperty',
//   [boilerPlateTypes.SINGLE_BOOLEAN]: 'genericSingleBoolean',
//   [boilerPlateTypes.SINGLE_NUMBER]: 'genericSingleNumberProperty',
//   [boilerPlateTypes.SELECTION]: 'genericSelection',
// }

export const boilerplateDir = `${__dirname}/../../resources/boilerplates`
// console.log(`boilerplateDir =${boilerplateDir}`)

export const typePrefixes = {
  CREATE: 'create',
  SELECT: 'select',
  USE: 'use',
  CONSTRAIN: 'constrain',
}

export const constraintTypes = {
  ID: 'ID',
  VALUE: 'value',
}

export const unitPrefixes = {
  SELECTABLE: 'selectable',
}

export const magicStrings = {
  NS_FILE: 'ns.yml',
  META_DIR: 'meta',
  DIFFS: 'diffs',
  TEMPLATE: 'template',
  TESTS_LOG: 'tests.log',
  COMP_DIR: 'components',
  CUSTOM_CODE_FILE: 'customCode.json',
  SLUG_PLACEHOLDER: '__slug__',
  OPEN_COMMENT_PLACEHOLDER: '__NS_OPEN__',
  CLOSE_COMMENT_PLACEHOLDER: '__NS_CLOSE__',
  STANDARD_UNIT: 'standard',
  START_OF_FILE_FILE: 'START_OF_FILE.hbs',
  FILE_TEMPLATES: 'fileTemplates',
  GENERIC_FILE: 'generic.hbs',
  CONFIG_FILE: 'config.yml',
  SAMPLE_NS_FILE: 'sample.ns.yml',
  README_FILE: 'README.md',
  DOCUMENTATION: 'https://ns-flip.nostack.net/',
}

export const feedbackForm = {
  URL: 'https://docs.google.com/forms/d/1DooR4toIL-15Ozk6cxB1A8gMJR5e3dntalYAr60PM9Q/formResponse',
  fields: {
    MESSAGE_TYPE: 'entry.2118049504',
    SUBJECT: 'entry.1563192314',
    MESSAGE: 'entry.7330959',
    EMAIL: 'entry.1551316295',
  },
}

export const suffixes = {
  BACKUP_DIR: '.backup',
  TEST_DIR: '.test',
  STARTUP_DIR: '.starter',
}

export const docPages = {
  BUILDING_CODE_BASE: 'Building-Code-Bases',
  SETUP: 'Setup-Sequence',
}

export const markupTags = {
  CUSTOM_START: 'ns__custom_start',
  CUSTOM_END: 'ns__custom_end',
  SECTION_START: 'ns__start_section',
  SECTION_END: 'ns__end_section',
  REPLACEMENT_START: 'ns__start_replacement',
  REPLACEMENT_END: 'ns__end_replacement',
  FILE_INFO: 'ns__file',
}

const NS_DOMAIN = 'https://www.nostack.net'
const NS_FLIP_NPM = 'https://www.npmjs.com/package/ns-front'

export const links = {
  NS_RULES: `${NS_DOMAIN}/ns-front/`,
  TEST_RESULTS: `${NS_FLIP_NPM}#working-with-test-results`,
}

export const standardIgnored = [
  'package.json',
  '.git',
  'package-lock.json',
  'meta',
]

export interface Delimiters {
  open: string;
  close: string;
}