const chalk = require('chalk')
const fs = require('fs-extra')

export async function copyTemplateToMeta(codeTemplateDir: string, templateDir: string) {
  try {
    await fs.ensureDir(codeTemplateDir)
    await fs.copy(templateDir, codeTemplateDir)
  } catch (error) {
    throw new Error(chalk.red(`error copying the template over from ${templateDir}.`) +
            `Here is the error reported:\n${error}`)
  }
}
