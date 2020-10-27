interface ConfigurationDirectories {
    components: string;

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
    specs?: any;
}

export interface StaticFileTypesSpecList {
    [fileType: string]: StaticFileTypeSpec;
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
    static: StaticFileTypesSpecList;
}
