import {Command, flags} from '@oclif/command'
import {isRequired} from '../inputs/isRequired'
import {regenerateCode} from '../codeGeneration/regenerateCode'

function isRequiredForRegenerate(paramName: string, flag: string) {
  return isRequired(paramName, 'regenerate', flag)
}

export default class Regenerate extends Command {
  static description = 'regenerates code based on a meta file `ns.yml`,' +
    ' custom changes, and a starter.' +
    ' The code directory must have been created for the first time using `newcode`.'

  static examples = [
    '$ nd regenerate -c ~/projects/myapp',
  ]

  static flags = {
    codeDir: flags.string({char: 'c', description: 'code directory'}),
    help: flags.help({char: 'h'}),
  }

  static args = []

  async run() {
    const {flags} = this.parse(Regenerate)

    const codeDir = flags.codeDir || isRequiredForRegenerate('codeDir', 'c')

    await regenerateCode(codeDir)

    this.log('Successfully regenerated!  For documentation: https://github.com/NoStackApp/ns-flip/wiki')
  }
}
