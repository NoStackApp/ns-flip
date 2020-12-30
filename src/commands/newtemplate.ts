import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'
import {newTemplateQuestions} from '../templates/new/newTemplateQuestions'
import {TemplateRequirements} from '../templates/new/TemplateRequirements'
import {generateTemplateFiles} from '../templates/new/generateTemplateFiles'
import {links, suffixes} from '../shared/constants'
import {setupDependencies} from '../templates/new/dependencies/setupDependencies'
import {getConfig} from '../shared/configs/getConfig'
import {executePreCommands} from '../templates/new/preCommands/executePreCommands'
import {setPackagesToSuggestInserting} from '../templates/new/dependencies/setPackagesToSuggestInserting'
import {setConfig} from '../shared/configs/setConfig'
import {installDependencies} from '../templates/new/dependencies/installDependencies'
import {getPreCommands} from '../templates/new/preCommands/getPreCommands'
import * as chalk from 'chalk'
import {resolveDir} from '../shared/resolveDir'
import {printInstructionsForNewTemplate} from '../templates/new/printInstructionsForNewTemplate'

const fs = require('fs-extra')

async function createNewTemplate(model: string, defaultTemplateDir: string) {
  const defaults = {
    model,
    templateDir: defaultTemplateDir || '',
  }
  const responses: TemplateRequirements = await newTemplateQuestions(defaults)
  await generateTemplateFiles(responses)

  const {templateDir} = responses

  const config = await getConfig(templateDir)
  const modelDir = `${templateDir}${suffixes.MODEL_DIR}`
  const codeDir = `${templateDir}${suffixes.SAMPLE_DIR}`

  const starterDir = codeDir + suffixes.STARTUP_DIR
  await getPreCommands(config)

  await executePreCommands(config, starterDir, {codeDir})
  fs.ensureDir(starterDir) // if no preCommands created the starterDir, we do so now.

  const suggestedDependencies = await setPackagesToSuggestInserting(starterDir, modelDir)

  if (suggestedDependencies) await setupDependencies(suggestedDependencies, config)
  await setConfig(templateDir, config)
  await installDependencies(config, starterDir)

  // console.log(`config = ${JSON.stringify(config, null, 2)}`)
  await setConfig(templateDir, config)

  return templateDir
}

export default class Newtemplate extends Command {
  static description = 'create new template.'

  static flags = {
    help: flags.help({char: 'h'}),
    model: flags.string({
      char: 'm',
      description: 'directory containing the model code base from which you want to template',
      required: false,
    }),
    templateDir: flags.string({
      char: 't',
      description: 'directory for the template',
      required: false,
    }),

  }

  static examples = [
    '$ ns newtemplate -m $MODEL -t $TEMPLATE ',
  ]

  async run() {
    checkForUpdates()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {flags} = this.parse(Newtemplate)
    const model = resolveDir(flags.model)
    const defaultTemplateDir = resolveDir(flags.templateDir)

    try {
      const templateDir = await createNewTemplate(model, defaultTemplateDir)
      this.log(printInstructionsForNewTemplate(templateDir))
    } catch (error) {
      this.log(error)
      throw new Error(`Problem creating template: ${error}`)
    }
  }
}
