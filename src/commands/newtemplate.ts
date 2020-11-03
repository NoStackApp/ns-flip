import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'
import {newTemplateQuestions} from '../templates/newTemplateQuestions'
import {TemplateRequirements} from '../templates/TemplateRequirements'
import {generateTemplateFiles} from '../templates/generateTemplateFiles'

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
  const templateNameShortened = templateName.replace('ns-template-', '')

  return `Created the template at '${fullNsDir}/templates/${templateName}'.
See instructions to get it working:
    https://github.com/NoStackApp/ns-flip/wiki/Creating-Templates.

Paste the following into your browser to set the variables used in the examples there
(you may want to save the following lines to a file to reuse easily):

NS_DIR=${fullNsDir}
TEMPLATES=$NS_DIR/templates~
STARTERS=$NS_DIR/starters
SAMPLES=$NS_DIR/samples
ORIGINAL=${originalPath}

TEMPLATE=$TEMPLATES/${templateName}
SAMPLE=$SAMPLES/${originalName}
STARTER=$STARTERS/${templateNameShortened}-starter
CODE=$SAMPLES/${templateNameShortened}-code
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
      const responses: TemplateRequirements = await newTemplateQuestions()
      await generateTemplateFiles(responses)
      this.log(printInstructionsForNewTemplate(responses))
    } catch (error) {
      throw new Error(`Problem creating starter: ${error}`)
    }
  }
}
