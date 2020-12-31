import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'
import {resolveDir} from '../shared/resolveDir'
import {removeCodeModelDiscrepancies} from '../templates/discrepancies/removeCodeModelDiscrepancies'

export default class Filediffs extends Command {
  static description = 'compare the files in your sample target code ' +
    'and in the code being generated. In some cases makes suggestions.'

  static flags = {
    help: flags.help({char: 'h'}),
    codeDir: flags.string({char: 'c', description: 'code directory.  Will override the default'}),
    modelDir: flags.string({char: 's', description: 'model directory.  Will override the default'}),
  }

  static args = [
    {
      name: 'templateDir',
      required: true,
      description: 'directory containing the template',
      hidden: false,
    },

  ]

  static examples = [
    '$ ns filediffs $TEMPLATE',
    '$ ns filediffs $TEMPLATE -c $CODE -m $MODEL',
  ]

  async run() {
    checkForUpdates()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {flags, args} = this.parse(Filediffs)

    const templateDir = resolveDir(args.templateDir)
    const code = resolveDir(flags.codeDir)
    const model = resolveDir(flags.modelDir)

    try {
      await removeCodeModelDiscrepancies(
        templateDir, code, model
      )
    } catch (error) {
      this.log(error)
      this.error(`cannot compare directories: ${error}`)
    }
  }
}
