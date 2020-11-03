import {magicStrings} from '../constants'
import {TemplateRequirements} from './TemplateRequirements'

const chalk = require('chalk')
// const execa = require('execa')
const expandTilde = require('expand-tilde')
const fs = require('fs-extra')
const Listr = require('listr')
const path = require('path')

// const config = require('../templates/fileTemplates/config.file.hbs')
// touch generic.hbs
// touch sample.ns.yml
// touch README.md

import {dirOptions} from '../shared/dirOptions'
// import {help} from '@oclif/command/lib/flags'
import {loadFileTemplate} from '../shared/loadFileTemplate'

export async function newTemplateTasks(requirements: TemplateRequirements) {
  const {
    nsDir,
    original,
    templateName,
    category,
    customDir,
    fileFilter,
  } = requirements

  const fullNsDir = expandTilde(nsDir)
  const originalPath = expandTilde(original)

  const originalParsed = path.parse(originalPath)
  const originalName = originalParsed.name

  const templatesDir = `${fullNsDir}/templates`
  const startersDir = `${fullNsDir}/starters`
  const samplesDir = `${fullNsDir}/samples`

  const sample = `${samplesDir}/${originalName}`
  const template = `${templatesDir}/ns-template-${templateName}`

  const newTemplateTasklist = [
    {
      title: 'Set up Recommended Directories',
      task: async () => {
        try {
          await fs.ensureDir(fullNsDir, dirOptions)
          await fs.ensureDir(templatesDir, dirOptions)
          await fs.ensureDir(startersDir, dirOptions)
          await fs.ensureDir(samplesDir, dirOptions)
        } catch (error) {
          throw new Error(`${chalk.red('error creating recommended directories:')}
          ${error}`)
        }
      },
    },
    {
      title: 'Create SAMPLE and TEMPLATE',
      task: async () => {
        const standard = `${template}/standard`
        const partials = `${template}/partials`
        const helpers = `${template}/helpers`
        const staticDir = `${template}/static`

        try {
          await fs.copy(originalPath, sample)
        } catch (error) {
          throw new Error(`${chalk.red(`error creating copying ${originalPath} to SAMPLE`)}
          ${error}`)
        }

        try {
          await fs.ensureDir(template, dirOptions)
          await fs.ensureDir(standard, dirOptions)
          await fs.ensureDir(partials, dirOptions)
          await fs.ensureDir(helpers, dirOptions)
          await fs.ensureDir(staticDir, dirOptions)
        } catch (error) {
          throw new Error(`${chalk.red('error creating recommended TEMPLATE directories:')}
          ${error}`)
        }
      },
    },
    {
      title: 'Generate Files',
      task: async () => {
        const fileTemplatesDir = `${__dirname}/${magicStrings.FILE_TEMPLATES}`

        const generic = `${fileTemplatesDir}/${magicStrings.GENERIC_FILE}`

        const startOfFile = `${fileTemplatesDir}/${magicStrings.START_OF_FILE_FILE}.hbs`
        const config = `${fileTemplatesDir}/${magicStrings.CONFIG_FILE}.hbs`
        const sampleNs = `${fileTemplatesDir}/${magicStrings.SAMPLE_NS_FILE}.hbs`
        const readme = `${fileTemplatesDir}/${magicStrings.README_FILE}.hbs`

        const context = {
          templateName,
          category,
          templateDirectory: template,
          customDir,
          fileFilter,
        }

        try {
          await fs.copy(generic, `${template}/${magicStrings.GENERIC_FILE}`)

          const readmeTemplate = await loadFileTemplate(readme)
          await fs.outputFile(`${template}/${magicStrings.README_FILE}`, readmeTemplate(context))
          const configTemplate = await loadFileTemplate(config)
          await fs.outputFile(`${template}/${magicStrings.CONFIG_FILE}`, configTemplate(context))
          const sampleNsFileTemplate = await loadFileTemplate(sampleNs)
          await fs.outputFile(`${template}/${magicStrings.SAMPLE_NS_FILE}`, sampleNsFileTemplate(context))
          const startOfFileTemplate = await loadFileTemplate(startOfFile)
          await fs.outputFile(`${template}/${magicStrings.START_OF_FILE_FILE}`, startOfFileTemplate(context))
        } catch (error) {
          throw new Error(`${chalk.red('error creating recommended TEMPLATE directories:')}
          ${error}`)
        }
      },
    },
  ]

  return new Listr(newTemplateTasklist)
}

