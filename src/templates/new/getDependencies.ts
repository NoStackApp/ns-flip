const fs = require('fs-extra')

export async function getDependencies(codeDir: string) {
  let codeDependencies
  let codeDevDependencies
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
