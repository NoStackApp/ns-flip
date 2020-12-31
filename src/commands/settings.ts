import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'
import {getConfig} from '../shared/configs/getConfig'
import {dirNames} from '../shared/constants'
import {getNsInfo} from '../shared/nsFiles/getNsInfo'
import {resolveDir} from '../shared/resolveDir'
import {settingsMenu} from '../codeGeneration/codeBases/settings/settingsMenu'
import {attention} from '../shared/constants/chalkColors'
import {regenerateCode} from '../codeGeneration/regenerateCode'

const diff = require('deep-object-diff').diff
const inquirer = require('inquirer')

async function promptToGenerateCode(codeDir: string,) {
  const questions = [{
    type: 'confirm',
    name: 'generate',
    message: 'Your settings have changed. ' +
      attention('Generate the code now with your changes?') +
      ' (This is recommended, but is not done by default.)',
    default: false,
  }]
  const answers = await inquirer.prompt(questions)
  if (answers.generate) {
    await regenerateCode(codeDir, {codeDir})
    // eslint-disable-next-line no-console
    console.log(`Your code has been regenerated at ${codeDir}`)
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
        `/${dirNames.META}/${dirNames.TEMPLATE}`)
      const nsInfo = await getNsInfo(codeDir)
      const originalSettings = JSON.parse(JSON.stringify(nsInfo))

      const updatedSettings = await settingsMenu(
        config, nsInfo, codeDir
      )
      if (!updatedSettings) return

      const changedSettings = diff(originalSettings, updatedSettings)
      if (Object.keys(changedSettings).length > 0) {
        // there were changes to the settings made
        await promptToGenerateCode(codeDir)
      }
    } catch (error) {
      this.error(error)
      throw new Error(`error with settings: ${error}`)
    }
  }
}
