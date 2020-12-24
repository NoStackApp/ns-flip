import {dirNames, suffixes} from '../../shared/constants'
import {TemplateRequirements} from './TemplateRequirements'
// import {help} from '@oclif/command/lib/flags'
import {ensureDirectory} from '../../shared/ensureDirectory'
import {createTemplateFiles} from './createTemplateFiles'

const chalk = require('chalk')
const fs = require('fs-extra')

// const execa = require('execa')
const expandTilde = require('expand-tilde')
const Listr = require('listr')
// const path = require('path')

async function createSampleAndTemplate(sample: string, originalPath: string, template: string) {
  const createTemplateDirectory = async (dirName: string) =>
    ensureDirectory(`${template}/${dirName}`)

  try {
    // if (await fs.pathExists(sample))
    //   throw new Error(`a sample file ${sample} already exists.` +
    //   '  Please move that directory or create a new project name.')
    await fs.remove(sample)
    await fs.copy(originalPath, sample)
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

export async function newTemplateTasks(requirements: TemplateRequirements) {
  const {
    nsDir,
    original,
    templateName,
  } = requirements

  const fullNsDir = expandTilde(nsDir)
  const originalPath = expandTilde(original)

  // const originalParsed = path.parse(originalPath)
  // const originalName = originalParsed.name

  const templatesDir = `${fullNsDir}/${dirNames.TEMPLATES}`
  const samplesDir = `${fullNsDir}/${dirNames.SAMPLES}`
  const sample = `${samplesDir}/${templateName}-code${suffixes.SAMPLE_DIR}`
  const template = `${templatesDir}/ns-template-${templateName}`

  const newTemplateTasklist = [
    {
      title: 'Set up Recommended Directories',
      task: async () => {
        try {
          await ensureDirectory(fullNsDir)
          await ensureDirectory(templatesDir)
          // await ensureDirectory(startersDir)
          await ensureDirectory(samplesDir)
        } catch (error) {
          throw new Error(`${chalk.red('error creating recommended directories:')}
          ${error}`)
        }
      },
    },
    {
      title: 'Create SAMPLE and TEMPLATE',
      task: async () => {
        await createSampleAndTemplate(sample, originalPath, template)
      },
    },
    {
      title: 'Generate Files',
      task: async () => {
        createTemplateFiles(requirements)
      },
    },
  ]

  return new Listr(newTemplateTasklist)
}

