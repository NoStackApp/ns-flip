const fs = require('fs-extra')

export interface DependencyList {
  [packageName: string]: string;
}

export async function getDependencies(codeDir: string) {
  let codeDependencies: DependencyList = {}
  let codeDevDependencies: DependencyList = {}
  const codePackageJsonPath = `${codeDir}/package.json`
  if (await fs.pathExists(codePackageJsonPath)) {
    const codePackageJson = await fs.readJson(codePackageJsonPath)
    codeDependencies = codePackageJson.dependencies
    codeDevDependencies = codePackageJson.devDependencies
  }

  return {
    codeDependencies,
    codeDevDependencies,
  }
}
