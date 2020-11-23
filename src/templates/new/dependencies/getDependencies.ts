import {DependencySet} from './dependencyTypes'

const fs = require('fs-extra')

export async function getDependencies(codeDir: string) {
  const dependencySet: DependencySet = {
    codeDependencies: {},
    codeDevDependencies: {},
  }
  const codePackageJsonPath = `${codeDir}/package.json`
  if (await fs.pathExists(codePackageJsonPath)) {
    const codePackageJson = await fs.readJson(codePackageJsonPath)
    dependencySet.codeDependencies = codePackageJson.dependencies
    dependencySet.codeDevDependencies = codePackageJson.devDependencies
  }

  return dependencySet
}
