interface DependencyChoice {
    name: string;
}

export interface DependencyChoiceList {
    [index: number]: DependencyChoice;
}

export interface AnswersForPackages {
  mainPackages: string[];
  devPackages: string[];
  useVersions: string;
}

export interface DependencyList {
  [packageName: string]: string;
}

export interface DependencySet {
  codeDependencies: DependencyList;
  codeDevDependencies: DependencyList;
}

