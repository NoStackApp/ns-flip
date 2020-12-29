import execa = require('execa');

const chalk = require('chalk')
const fs = require('fs-extra')

export async function copyTemplateToMeta(codeTemplateDir: string, templateDir: string) {
  if (codeTemplateDir === templateDir) return
  try {
    await fs.ensureDir(codeTemplateDir)
    await fs.emptyDir(codeTemplateDir)
    // copyProjectDirectory(templateDir, codeTemplateDir)
    await fs.copy(templateDir, codeTemplateDir)
    const templatePackageJsonPath = `${codeTemplateDir}/package.json`
    if (await fs.pathExists(templatePackageJsonPath)) {
      await execa(
        'npm',
        ['install'],
        {cwd: codeTemplateDir}
      )
    }
    // , {
    //   filter: function (path: any) {
    //     return path.indexOf('node_modules') <= -1
    //   },
    // })
    // if (await fs.pathExists(`${codeTemplateDir}/package.json`)) {
    //   await execa(
    //     'npm',
    //     ['install', '--prefix', codeTemplateDir],
    //   )
    // }
  } catch (error) {
    throw new Error(chalk.red(`error copying the template over from ${templateDir} to ${codeTemplateDir}.`) +
            `Here is the error reported:\n${error}`)
  }
}
