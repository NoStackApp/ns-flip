import {ensureDirectory} from '../../shared/ensureDirectory'
import {dirNames} from '../../shared/constants'

export const chalk = require('chalk')
const fs = require('fs-extra')

export async function createSampleAndTemplate(samplePath: string, originalPath: string, template: string) {
  const createTemplateDirectory = async (dirName: string) =>
    ensureDirectory(`${template}/${dirName}`)

  try {
    // if (await fs.pathExists(sample))
    //   throw new Error(`a sample file ${sample} already exists.` +
    //   '  Please move that directory or create a new project name.')
    await fs.remove(samplePath)
    // await fs.copy(originalPath, samplePath)
  } catch (error) {
    throw new Error(`${chalk.red(`error copying ${originalPath} to SAMPLE`)}
          ${error}`)
  }

  try {
    await ensureDirectory(template)
    await createTemplateDirectory(dirNames.STANDARD)
    await createTemplateDirectory(dirNames.PARTIALS)
    await createTemplateDirectory(dirNames.HELPERS)
    await createTemplateDirectory(dirNames.STATIC)
  } catch (error) {
    throw new Error(`${chalk.red('error creating recommended TEMPLATE directories:')}
          ${error}`)
  }
}
