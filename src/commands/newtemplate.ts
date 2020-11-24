import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'
import {newTemplateQuestions} from '../templates/new/newTemplateQuestions'
import {TemplateRequirements} from '../templates/new/TemplateRequirements'
import {generateTemplateFiles} from '../templates/new/generateTemplateFiles'
import {magicStrings, suffixes} from '../shared/constants'
import {setupDependencies} from '../templates/new/dependencies/setupDependencies'
import {getConfiguration} from '../shared/configs/getConfiguration'
import {executePreCommands} from '../templates/new/preCommands/executePreCommands'
import {setPackagesToSuggestInserting} from '../templates/new/dependencies/setPackagesToSuggestInserting'
import {updateConfig} from '../shared/configs/updateConfig'
import {installDependencies} from '../templates/new/dependencies/installDependencies'
import {getPreCommands} from '../templates/new/preCommands/getPreCommands'

const expandTilde = require('expand-tilde')
const path = require('path')

function printInstructionsForNewTemplate(requirements: TemplateRequirements) {
  const {
    nsDir,
    original,
    templateName,
  } = requirements

  const fullNsDir = expandTilde(nsDir)
  const originalPath = expandTilde(original)

  const originalParsed = path.parse(originalPath)
  const originalName = originalParsed.name
  // const templateNameShortened = templateName.replace('ns-template-', '')

  return `Created the template at '${fullNsDir}/templates/ns-template-${templateName}'.
See instructions to get it working:
    ${magicStrings.DOCUMENTATION}/Creating-Templates.

Paste the following into your browser to set the variables used in the examples there
(you may want to save the following lines to a file to reuse easily):

NS_DIR=${fullNsDir}
TEMPLATES=$NS_DIR/templates
SAMPLES=$NS_DIR/samples
ORIGINAL=${originalPath}

TEMPLATE=$TEMPLATES/ns-template-${templateName}
SAMPLE=$SAMPLES/${originalName}
CODE=$SAMPLES/${templateName}-code
`
}

export default class Newtemplate extends Command {
  static description = 'create new template.'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static examples = [
    '$ ns newtemplate',
  ]

  async run() {
    checkForUpdates()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {flags} = this.parse(Newtemplate)

    try {
      const responses: TemplateRequirements = await newTemplateQuestions()
      await generateTemplateFiles(responses)
      this.log(printInstructionsForNewTemplate(responses))

      const {
        nsDir,
        original,
        templateName,
      } = responses
      const fullNsDir = expandTilde(nsDir)

      const originalPath = expandTilde(original)

      const originalParsed = path.parse(originalPath)
      const originalName = originalParsed.name

      const templates = `${fullNsDir}/templates`
      const samples = `${fullNsDir}/samples`

      const templateDir = `${templates}/ns-template-${templateName}`
      const config = await getConfiguration(templateDir)
      const sampleDir = `${samples}/${originalName}`
      const codeDir = `${samples}/${templateName}-code`

      const starterDir = codeDir + suffixes.STARTUP_DIR
      await getPreCommands(config)

      await executePreCommands(config, starterDir)

      const suggestedDependencies = await setPackagesToSuggestInserting(starterDir, sampleDir)

      await setupDependencies(suggestedDependencies, config)
      await updateConfig(templateDir, config)
      await installDependencies(config, starterDir)

      // console.log(`config = ${JSON.stringify(config, null, 2)}`)
      await updateConfig(templateDir, config)
    } catch (error) {
      this.log(error)
      throw new Error(`Problem creating template: ${error}`)
    }
  }
}
