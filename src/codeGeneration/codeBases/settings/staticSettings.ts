import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import {updateStaticTypeInstances} from './instances/updateStaticTypeInstances'
import {menuChoices} from '../../../shared/constants'
import {Choice} from './settingsTypes'
import {attention, explanation, menuOption, statusUpdate} from '../../../shared/constants/chalkColors'

const chalk = require('chalk')
const inquirer = require('inquirer')

const TYPE = 'staticType'
interface AnswersForStaticType {
  [TYPE]: string;
}

export function staticTypesFromConfig(config: Configuration) {
  const staticTypes = config.static

  let staticTypeChoices: Choice[] = []
  if (staticTypes) {
    const types = Object.keys(staticTypes)
    staticTypeChoices = types.map((typeName: string) => {
      const {description} = staticTypes[typeName]
      return {
        name: description ?  menuOption(typeName) + ' ' + explanation(description) : menuOption(typeName),
        value: typeName,
        short: typeName,
      }
    })
  }
  return staticTypeChoices
}

export async function chooseStaticType(config: Configuration) {
  const choiceList: Choice[] = staticTypesFromConfig(config)

  // if (choiceList.length === 0) {
  //   return
  // }
  //
  // if (choiceList.length === 1) {
  //   return choiceList[0].value
  // }

  const quit = {
    name: attention(menuChoices.QUIT),
    value: menuChoices.QUIT,
    short: menuChoices.QUIT,
  }
  choiceList.push(quit)

  const questions = [{
    type: 'list',
    loop: false,
    message: `Updating Static Instances.  Choose a ${chalk.blueBright('static type')}.`,
    name: TYPE,
    choices: choiceList,
  }]

  const answers: AnswersForStaticType = await inquirer.prompt(questions)
  return answers.staticType
}

export async function staticSettings(config: Configuration, nsInfo: NsInfo, codeDir: string) {
  let staticType = await chooseStaticType(config)

  while (staticType) {
    if (staticType === menuChoices.QUIT) {
      // eslint-disable-next-line no-console
      console.log(statusUpdate('Finished updating static types...'))
      return
    }

    await updateStaticTypeInstances(staticType, config, nsInfo, codeDir)
    staticType = await chooseStaticType(config)
  }
}
