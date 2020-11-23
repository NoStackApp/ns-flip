import {removeNpmDependencyPrefix} from '../../../shared/removeNpmDependencyPrefix'
import {DependencySet} from './dependencyTypes'

const fs = require('fs-extra')
const semverGt = require('semver/functions/gt')

export async function setPackagesToSuggestInserting(starterDir: string, sampleDir: string) {
  // set starterDependencyList and sampleDependencyList.  If no package.json, then
  // is set to empty. ... Then
  // compare them and return the elements which are higher in sample than starter.
  const dependencySet: DependencySet = {
    codeDependencies: {},
    codeDevDependencies: {},
  }
  const starterPackageJsonPath = `${starterDir}/package.json`
  const samplePackageJsonPath = `${sampleDir}/package.json`

  try {
    if (await fs.pathExists(samplePackageJsonPath)) {
      let starterPackageJson
      if (await fs.pathExists(starterPackageJsonPath)) {
        starterPackageJson = await fs.readJson(starterPackageJsonPath)
      }

      const samplePackageJson = await fs.readJson(samplePackageJsonPath)

      const starterDependencies = starterPackageJson.dependencies
      const sampleDependencies = samplePackageJson.dependencies
      Object.keys(sampleDependencies).map(dependencyPackage => {
        const sampleDependency =
          removeNpmDependencyPrefix(
            sampleDependencies[dependencyPackage])
        const codeDependency =
          removeNpmDependencyPrefix(
            starterDependencies[dependencyPackage])
        if (codeDependency === '*') return
        if (!codeDependency || semverGt(sampleDependency, codeDependency)) {
          if (sampleDependency)
            dependencySet.codeDependencies[dependencyPackage] = sampleDependency
        }
      })

      const codeDevDependencies = starterPackageJson.devDependencies
      const sampleDevDependencies = samplePackageJson.devDependencies
      Object.keys(sampleDevDependencies).map(dependencyPackage => {
        const sampleDependency = removeNpmDependencyPrefix(sampleDevDependencies[dependencyPackage])
        const codeDependency = removeNpmDependencyPrefix(codeDevDependencies[dependencyPackage])
        if (codeDependency === '*') return
        if (!codeDependency || semverGt(sampleDependency, codeDependency)) {
          if (sampleDependency)
            dependencySet.codeDevDependencies[dependencyPackage] = sampleDependency
        }
      })
    }

    return dependencySet
  } catch (error) {
    // console.error(error)
    throw new Error(`cannot create list of packages to suggest for setup.  ${error}`)
  }
}

