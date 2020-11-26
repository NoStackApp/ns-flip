import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'
import {getConfig} from '../shared/configs/getConfig'
import {magicStrings} from '../shared/constants'
import {getNsInfo} from '../shared/nsFiles/getNsInfo'
import {staticSettings} from '../codeGeneration/codeBases/settings/staticSettings'

const expandTilde = require('expand-tilde')

export default class Filediffs extends Command {
  static description = 'create new template.'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'codeDir',
      required: true,
      description: 'directory containing the code',
      hidden: false,
    },

  ]

  static examples = [
    '$ ns settings $CODE',
  ]

  async run() {
    checkForUpdates()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {flags, args} = this.parse(Filediffs)

    const codeDir = expandTilde(args.codeDir)

    try {
      const config = await getConfig(codeDir +
        `/${magicStrings.META_DIR}/${magicStrings.TEMPLATE}`)
      const nsInfo = await getNsInfo(codeDir)

      // const configStatic = config.static
      // const nsStatic = nsInfo.static

      // console.log(`configStatic = ${JSON.stringify(configStatic, null, 2)}`)
      // console.log(`nsStatic = ${JSON.stringify(nsStatic, null, 2)}`)

      await staticSettings(config, nsInfo, codeDir)
    } catch (error) {
      this.error(error)
    }
  }
}
