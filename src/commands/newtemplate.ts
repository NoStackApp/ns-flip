import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'
import {resolveDir} from '../shared/resolveDir'
import {printInstructionsForNewTemplate} from '../templates/new/printInstructionsForNewTemplate'
import {createNewTemplate} from '../templates/new/createNewTemplate'

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
