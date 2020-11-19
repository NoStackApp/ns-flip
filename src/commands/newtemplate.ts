import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'
import {newTemplateQuestions} from '../templates/new/newTemplateQuestions'
import {TemplateRequirements} from '../templates/new/TemplateRequirements'
import {generateTemplateFiles} from '../templates/new/generateTemplateFiles'
import {magicStrings, suffixes} from '../shared/constants'
import {setupCreation} from '../templates/new/setupCreation'
import {getConfiguration} from '../shared/getConfiguration'
import {setPreCommands} from '../templates/new/setPreCommands'

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

    // const {flags} = this.parse(Newtemplate)

    try {
      const config = await getConfiguration('/home/yisroel/ns/samples')
      const sampleDir = '/home/yisroel/temp/clis/projectory'
      const codeDir = '/home/yisroel/ns/samples/code5'

      const starterDir = codeDir + suffixes.STARTUP_DIR
      await setPreCommands(config, starterDir)
      return

      await setupCreation(sampleDir, config)

      const responses: TemplateRequirements = await newTemplateQuestions()
      await generateTemplateFiles(responses)
      this.log(printInstructionsForNewTemplate(responses))
    } catch (error) {
      throw new Error(`Problem creating template: ${error}`)
    }
  }
}
