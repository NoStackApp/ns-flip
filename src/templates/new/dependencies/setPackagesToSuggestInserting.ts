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
    if (!await fs.pathExists(samplePackageJsonPath)) {
      // there's no package.json file
      return
    }

    console.log(`path exists: ${samplePackageJsonPath}`)
    if (await fs.pathExists(samplePackageJsonPath)) {
      let starterPackageJson
      if (await fs.pathExists(starterPackageJsonPath)) {
        starterPackageJson = await fs.readJson(starterPackageJsonPath)
      } else
        starterPackageJson = {}

      console.log(`starterPackageJson: ${JSON.stringify(starterPackageJson)}`)
      const samplePackageJson = await fs.readJson(samplePackageJsonPath)

      const starterDependencies = starterPackageJson.dependencies
      const sampleDependencies = samplePackageJson.dependencies
      console.log(`starterDependencies: ${JSON.stringify(starterDependencies)}`)
      console.log(`sampleDependencies: ${JSON.stringify(sampleDependencies)}`)
      Object.keys(sampleDependencies).map(dependencyPackage => {
        const sampleDependency =
          removeNpmDependencyPrefix(
            sampleDependencies[dependencyPackage])

        if (!starterDependencies) {
          if (sampleDependency)
            dependencySet.codeDependencies[dependencyPackage] = sampleDependency
          return
        }

        const starterDependency =
          removeNpmDependencyPrefix(
            starterDependencies[dependencyPackage])
        if (starterDependency === '*') return
        if (!starterDependency || semverGt(sampleDependency, starterDependency)) {
          if (sampleDependency)
            dependencySet.codeDependencies[dependencyPackage] = sampleDependency
        }
      })

      console.log(`dependencySet.codeDependencies: ${JSON.stringify(dependencySet.codeDependencies)}`)
      const starterDevDependencies = starterPackageJson.devDependencies
      const sampleDevDependencies = samplePackageJson.devDependencies
      Object.keys(sampleDevDependencies).map(dependencyPackage => {
        const sampleDependency = removeNpmDependencyPrefix(sampleDevDependencies[dependencyPackage])

        if (!starterDevDependencies) {
          if (sampleDependency)
            dependencySet.codeDevDependencies[dependencyPackage] = sampleDependency
          return
        }

        const codeDependency = removeNpmDependencyPrefix(starterDevDependencies[dependencyPackage])
        if (codeDependency === '*') return
        if (!codeDependency || semverGt(sampleDependency, codeDependency)) {
          if (sampleDependency)
            dependencySet.codeDevDependencies[dependencyPackage] = sampleDependency
        }
      })
      console.log(`dependencySet: ${JSON.stringify(dependencySet)}`)
    }

    return dependencySet
  } catch (error) {
    // console.error(error)
    throw new Error(`cannot create list of packages to suggest for setup.  ${error}`)
  }
}

