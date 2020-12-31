import {suffixes} from '../../shared/constants'
import {TemplateRequirements} from './TemplateRequirements'
import {ensureDirectory} from '../../shared/ensureDirectory'
import {createTemplateFiles} from './createTemplateFiles'
import {chalk, createSampleAndTemplate} from './createSampleAndTemplate'

const expandTilde = require('expand-tilde')
const Listr = require('listr')

export async function newTemplateTasks(requirements: TemplateRequirements) {
  const {
    templateDir,
    original,
  } = requirements

  const modelPath = expandTilde(original)
  const samplePath = `${templateDir}${suffixes.SAMPLE_DIR}`

  const newTemplateTasklist = [
    {
      title: 'Set up Recommended Directories',
      task: async () => {
        try {
          await ensureDirectory(templateDir)
        } catch (error) {
          throw new Error(`${chalk.red('error creating recommended directories:')}
          ${error}`)
        }
      },
    },
    {
      title: 'Create SAMPLE and TEMPLATE folders',
      task: async () => {
        await createSampleAndTemplate(
          samplePath, modelPath, templateDir
        )
      },
    },
    {
      title: 'Generate Files',
      task: async () => {
        await createTemplateFiles(requirements)
      },
    },
  ]

  return new Listr(newTemplateTasklist)
}

