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

const domains = {
  NS_DOMAIN: 'https://www.nostack.net',
  NS_FLIP_NPM: 'https://www.npmjs.com/package/ns-front',
  NS_FLIP_DOMAIN: 'https://ns-flip.nostack.net/',
}

export const links = {
  DOCUMENTATION: domains.NS_FLIP_DOMAIN,
  TEST_RESULTS: `${domains.NS_FLIP_DOMAIN}/Understanding-Test-Results`,
  NS_RULES: `${domains.NS_FLIP_DOMAIN}/Safe-Custom-Code`,
}

export const magicStrings = {
  STANDARD_UNIT: 'standard',
}

export const placeholders = {
  CLOSE_COMMENT: '__NS_CLOSE__',
  OPEN_COMMENT: '__NS_OPEN__',
  SLUG: '__slug__',
}

export const dirNames = {
  FILE_TEMPLATES: 'fileTemplates',
  GENERAL: 'general',
  HELPERS: 'helpers',
  META_DIR: 'meta',
  PARTIALS: 'partials',
  SAMPLES: 'samples',
  STANDARD: 'standard',
  STATIC: 'static',
  TEMPLATE: 'template',
}

export const fileNames = {
  CONFIG_FILE: 'config.yml',
  CUSTOM_CODE_FILE: 'customCode.json',
  DIFFS: 'diffs',
  GENERIC_FILE: 'generic.hbs',
  NS_FILE: 'ns.yml',
  PACKAGE_INFO: 'packageInfo.json.hbs',
  README_FILE: 'README.md',
  SAMPLE_NS_FILE: 'sample.ns.yml',
  START_OF_FILE_FILE: 'START_OF_FILE.hbs',
  TESTS_LOG: 'tests.log',
}

export const META_DELIMITER = '__'

export const ADD_NEW_VALUE = META_DELIMITER + 'add' + META_DELIMITER

export const menuChoices = {
  QUIT: 'quit',
  ADD_NEW: 'add',

}

export const commands = {
  GENERATE: 'generate',
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
  SAMPLE_DIR: '.sample',
  MODEL_DIR: '.model',
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

export const standardIgnored = [
  'package.json',
  '.git',
  'package-lock.json',
  'meta',
  '.idea',
]

export interface Delimiters {
  open: string;
  close: string;
}

export const questionNames = {
  SETTINGS_TYPE: 'settingsType',
}

export const answerValues = {
  settingsTypes:
    {
      GENERAL: 'general',
      STATIC: 'static',
      DYNAMIC: 'dynamic',
    },

}
