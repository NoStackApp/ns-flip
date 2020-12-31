import {dirNames, fileNames, links} from '../../shared/constants'
import {loadFileTemplate} from '../loadFileTemplate'
import {TemplateRequirements} from './TemplateRequirements'

export const chalk = require('chalk')
export const fs = require('fs-extra')

export async function createTemplateFiles(requirements: TemplateRequirements) {
  const {
    templateDir,
    templateName,
    category,
    customDir,
    fileFilter,
  } = requirements

  const context = {
    templateName,
    category,
    nsFlipDocumentation: links.DOCUMENTATION,
    templateDirectory: templateDir,
    customDir,
    fileFilter,
  }

  const fileTemplatesDir = `${__dirname}/../${dirNames.FILE_TEMPLATES}`

  async function outputTemplateFile(fileName: string) {
    const fileTemplateName = `${fileTemplatesDir}/${fileName}.hbs`
    const templateName = await loadFileTemplate(
      fileTemplateName, null, true
    )
    await fs.outputFile(`${templateDir}/${fileName}`, templateName(context))
  }

  const generic = `${fileTemplatesDir}/${fileNames.GENERIC_FILE}`
  const generalDir = `${templateDir}/${dirNames.GENERAL}`

  try {
    await fs.copy(generic, `${generalDir}/${fileNames.GENERIC_FILE}`)
    await outputTemplateFile(fileNames.README_FILE)
    await outputTemplateFile(fileNames.CONFIG_FILE)
    await outputTemplateFile(fileNames.SAMPLE_NS_FILE)
    await outputTemplateFile(fileNames.START_OF_FILE_FILE)

    // const readme = `${fileTemplatesDir}/${fileNames.README_FILE}.hbs`
    // const readmeTemplate = await loadFileTemplate(readme, true)
    // await fs.outputFile(`${template}/${fileNames.README_FILE}`, readmeTemplate(context))
    // const configPath = `${fileTemplatesDir}/${fileNames.CONFIG_FILE}.hbs`
    // const configTemplate = await loadFileTemplate(configPath, true)
    // await fs.outputFile(`${template}/${fileNames.CONFIG_FILE}`, configTemplate(context))
    // const sampleNs = `${fileTemplatesDir}/${fileNames.SAMPLE_NS_FILE}.hbs`
    // const sampleNsFileTemplate = await loadFileTemplate(sampleNs, true)
    // await fs.outputFile(`${template}/${fileNames.SAMPLE_NS_FILE}`, sampleNsFileTemplate(context))
    // const startOfFile = `${fileTemplatesDir}/${fileNames.START_OF_FILE_FILE}.hbs`
    // const startOfFileTemplate = await loadFileTemplate(startOfFile, true)
    // await fs.outputFile(`${template}/${dirNames.PARTIALS}/${fileNames.START_OF_FILE_FILE}`, startOfFileTemplate(context))
  } catch (error) {
    throw new Error(`${chalk.red('error creating recommended TEMPLATE directories:')}
          ${error}`)
  }
}
