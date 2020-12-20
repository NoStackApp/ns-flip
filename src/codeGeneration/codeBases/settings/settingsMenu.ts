import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import {exitOption, menuOption} from '../../../shared/constants/chalkColors'
import {DONE, types} from './types'
import {staticSettings} from './staticSettings'
import {updateSpecSubtree} from './specs/updateSpecSubtree'
import {setNsInfo} from '../../../shared/nsFiles/setNsInfo'

const inquirer = require('inquirer')
const settingsTypes =
    {
      GENERAL: 'general',
      STATIC: 'static',
      DYNAMIC: 'dynamic',
    }
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

export async function settingsMenu(
  config: Configuration,
  nsInfo: NsInfo,
  codeDir: string,
) {
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const answers = await inquirer.prompt(questions)
      if (answers[SETTINGS_TYPE] === DONE) {
        return nsInfo
      }
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
