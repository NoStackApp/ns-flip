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
}

export interface PlaceholderAppCreation {
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

export interface StaticTypeSpec {
  [fileType: string]: StaticFileTypeSpec;
}

export interface StaticTypesSpecList {
    [staticType: string]: StaticTypeSpec;
}

export interface FormatSpec {
    customFileFilter: string;
}

export interface Configuration {
    name: string;
    version: string;
    category: string;
    format: FormatSpec;
    componentTypes: ComponentTypes;
    dataFunctionTypes: DataFunctionTypes;
    dirs: ConfigurationDirectories;
    placeholderAppCreation: PlaceholderAppCreation;
    static: StaticTypesSpecList;
    ignore?: string[];
}
