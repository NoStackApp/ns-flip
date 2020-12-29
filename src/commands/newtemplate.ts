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

const fs = require('fs-extra')

function printInstructionsForNewTemplate(requirements: TemplateRequirements) {
  const {templateDir} = requirements

  return `Created the template at '${templateDir}'.
See instructions to get it working:
    ${links.DOCUMENTATION}/Creating-Templates.

Paste the following into your browser to set the variables used in the examples there
(you may want to save the following lines to a file to reuse easily):

TEMPLATE=${templateDir}
SAMPLE=${templateDir}-code.sample
CODE=${templateDir}-code
`
}

export default class Newtemplate extends Command {
  static description = 'create new template.'

  static flags = {
    help: flags.help({char: 'h'}),
    sample: flags.string({
      char: 's',
      description: 'directory containing the sample code from which you want to template',
      required: false,
    }),
    templateDir: flags.string({
      char: 't',
      description: 'directory for the template',
      required: false,
    }),

  }

  static examples = [
    '$ ns newtemplate -s $SAMPLE -t $TEMPLATE ',
  ]

  async run() {
    checkForUpdates()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {flags} = this.parse(Newtemplate)
    const sample = resolveDir(flags.sample)
    const defaultTemplateDir = resolveDir(flags.templateDir)

    try {
      const defaults = {
        sample,
        templateDir: defaultTemplateDir || '',
      }
      const responses: TemplateRequirements = await newTemplateQuestions(defaults)
      await generateTemplateFiles(responses)
      this.log(printInstructionsForNewTemplate(responses))

      const {templateDir} = responses

      const config = await getConfig(templateDir)
      const sampleDir = `${templateDir}-code${suffixes.SAMPLE_DIR}`
      const codeDir = `${templateDir}-code`

      const starterDir = codeDir + suffixes.STARTUP_DIR
      await getPreCommands(config)

      await executePreCommands(config, starterDir, {codeDir})
      fs.ensureDir(starterDir) // if no preCommands created the starterDir, we do so now.

      const suggestedDependencies = await setPackagesToSuggestInserting(starterDir, sampleDir)

      if (suggestedDependencies) await setupDependencies(suggestedDependencies, config)
      await setConfig(templateDir, config)
      await installDependencies(config, starterDir)

      // console.log(`config = ${JSON.stringify(config, null, 2)}`)
      await setConfig(templateDir, config)

      this.log(chalk.green(`\nYour template has been created at ${templateDir}. ` +
        `See documentation at ${links.DOCUMENTATION}`))
    } catch (error) {
      this.log(error)
      throw new Error(`Problem creating template: ${error}`)
    }
  }
}
