import {Configuration} from '../../../shared/constants/types/configuration'
import {Choice} from './settingsTypes'
import {exitOption, explanation, menuOption} from '../../../shared/constants/chalkColors'
import {menuChoices} from '../../../shared/constants'

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
        name: description ? menuOption(typeName) + ' ' + explanation(description) : menuOption(typeName),
        value: typeName,
        short: typeName,
      }
    })
  }
  return staticTypeChoices
}

export async function chooseStaticType(config: Configuration) {
  const choiceList: Choice[] = staticTypesFromConfig(config)
  choiceList.unshift()

  const quit = {
    name: exitOption(menuChoices.QUIT),
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
