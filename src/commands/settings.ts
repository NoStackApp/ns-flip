import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'
import {getConfig} from '../shared/configs/getConfig'
import {magicStrings} from '../shared/constants'
import {getNsInfo} from '../shared/nsFiles/getNsInfo'
import {staticSettings} from '../codeGeneration/codeBases/settings/staticSettings'
import {resolveDir} from '../shared/resolveDir'
import {exitOption, menuOption} from '../shared/constants/chalkColors'
import {DONE, types} from '../codeGeneration/codeBases/settings/types'
import {Configuration} from '../shared/constants/types/configuration'
import {NsInfo} from '../shared/constants/types/nsInfo'
import {updateSpecSubtree} from '../codeGeneration/codeBases/settings/specs/updateSpecSubtree'
import {setNsInfo} from '../shared/nsFiles/setNsInfo'

const inquirer = require('inquirer')

const settingsTypes =
  {
    GENERAL: 'general',
    STATIC: 'static',
    DYNAMIC: 'dynamic',
  }

async function settingsMenu(
  config: Configuration,
  nsInfo: NsInfo,
  codeDir: string,
) {
  const SETTINGS_TYPE = 'settingsType'
  const questions = [{
    type: 'list',
    name: SETTINGS_TYPE,
    message: 'What settings would you like to change?',
    choices: [
      {
        name: menuOption('General'),
        value: settingsTypes.GENERAL,
        short: 'General',
      },
      {
        name: menuOption('Static'),
        value: settingsTypes.STATIC,
        short: 'Static',
      },
      {
        name: exitOption('Quit'),
        value: DONE,
        short: 'quit',
      },
    ],
  }]

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const answers = await inquirer.prompt(questions)
      if (answers[SETTINGS_TYPE] === DONE) return
      if (answers[SETTINGS_TYPE] === settingsTypes.STATIC) await staticSettings(config, nsInfo, codeDir)
      if (answers[SETTINGS_TYPE] === settingsTypes.GENERAL) {
        const nsInfoGeneral = await updateSpecSubtree(
          nsInfo.general,
          config.general,
          types.TOP_LEVEL,
          'general settings',
          true,
        )

        nsInfo.general = nsInfoGeneral
        await setNsInfo(codeDir, nsInfo)
      }
    }
  } catch (error) {
    throw new Error(`in settings menu: ${error}`)
  }
}

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

    const codeDir = resolveDir(args.codeDir)

    try {
      const config = await getConfig(codeDir +
        `/${magicStrings.META_DIR}/${magicStrings.TEMPLATE}`)
      const nsInfo = await getNsInfo(codeDir)

      // const configStatic = config.static
      // const nsStatic = nsInfo.static

      // console.log(`configStatic = ${JSON.stringify(configStatic, null, 2)}`)
      // console.log(`nsStatic = ${JSON.stringify(nsStatic, null, 2)}`)

      await settingsMenu(config, nsInfo, codeDir)
    } catch (error) {
      this.error(error)
    }
  }
}
