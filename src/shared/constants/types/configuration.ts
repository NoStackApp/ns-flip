interface ConfigurationDirectories {
    components: string;
    custom: string;
    [key: string]: string;
}

export interface CommandSpec {
    title: string;
    file: string;
    arguments: string[];
    options?: any;
    prevent?: boolean|Function;
}

export interface SetupSequence {
    mainInstallation?: string[];
    devInstallation?: string[];
    preCommands?: CommandSpec[];
    interactive?: CommandSpec[];
}

export interface ComponentTypeSpec {
    singular: boolean;
    suffix?: string;
    prefix?: string;
}

export interface ComponentTypes {
    [name: string]: ComponentTypeSpec;
}

interface DataFunctionType {
    components: null | string[];
    requiresSource?: boolean;
    nodeType: string;
}

export interface DataFunctionTypes {
    [name: string]: DataFunctionType;
}

export interface StaticFileTypeSpec {
    suffix: string;
    name: string;
    directory: string;
}

export interface StaticFilesList {
  [fileType: string]: StaticFileTypeSpec;
}

export interface SpecSet {
  [name: string]: Specs;
}

export interface Specs {
  type: string;
  required: boolean;
  description?: string;
  contents?: SpecSet;
  default?: string|number|boolean;
  choices?: string[]|number[];

}

export interface StaticTypeSpec {
  description: string;
  specs: SpecSet;
  files: StaticFilesList;
}

export interface StaticTypesSpecList {
    [staticType: string]: StaticTypeSpec;
}

interface DelimiterList {
  [key: string]: string;
}

export interface FormatSpec {
    customFileFilter: string;
    defaultOpenComment?: string;
    defaultCloseComment?: string;
    openComment?: DelimiterList;
    closeComment?: DelimiterList;
}

export interface Configuration {
    name: string;
    version: string;
    category: string;
    format: FormatSpec;
    componentTypes: ComponentTypes;
    dataFunctionTypes: DataFunctionTypes;
    dirs: ConfigurationDirectories;
    setupSequence: SetupSequence;
    general: SpecSet;
    static: StaticTypesSpecList;
    ignore?: string[];
}
