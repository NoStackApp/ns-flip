import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import {exitOption, menuOption} from '../../../shared/constants/chalkColors'
import {DONE, types} from './types'
import {staticSettings} from './staticSettings'
import {updateSpecSubtree} from './specs/updateSpecSubtree'
import {setNsInfo} from '../../../shared/nsFiles/setNsInfo'
import {answerValues, questionNames} from '../../../shared/constants'

const inquirer = require('inquirer')

const questions = [{
  type: 'list',
  name: questionNames.SETTINGS_TYPE,
  message: 'What settings would you like to change?',
  choices: [
    {
      name: menuOption('General'),
      value: answerValues.settingsTypes.GENERAL,
      short: 'General',
    },
    {
      name: menuOption('Static'),
      value: answerValues.settingsTypes.STATIC,
      short: 'Static',
    },
    {
      name: exitOption('Quit'),
      value: DONE,
      short: 'quit',
    },
  ],
}]

export async function settingsMenu(
  config: Configuration,
  nsInfo: NsInfo,
  codeDir: string,
) {
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const answers = await inquirer.prompt(questions)
      if (answers[questionNames.SETTINGS_TYPE] === DONE) {
        return nsInfo
      }
      if (answers[questionNames.SETTINGS_TYPE] === answerValues.settingsTypes.STATIC) {
        const nsInfoStatic = await staticSettings(config, nsInfo, codeDir)
        nsInfo.static = nsInfoStatic
      }
      if (answers[questionNames.SETTINGS_TYPE] === answerValues.settingsTypes.GENERAL) {
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
