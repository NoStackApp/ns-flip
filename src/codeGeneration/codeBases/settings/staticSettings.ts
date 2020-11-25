import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import {updateStaticTypeInstances} from './updateStaticTypeInstances'
import {magicStrings, menuChoices} from '../../../shared/constants'
import {Choice} from './settingsTypes'

const chalk = require('chalk')
const inquirer = require('inquirer')

interface AnswersForStaticType {
  staticType: string;
}

function staticTypesFromConfig(config: Configuration) {
  const staticTypes = config.static

  let staticTypeChoices: Choice[] = []
  if (staticTypes) {
    const types = Object.keys(staticTypes)
    staticTypeChoices = types.map((typeName: string) => {
      return {
        name: chalk.bgBlueBright(typeName) + ': ' + staticTypes[typeName].description,
        value: typeName,
        short: typeName,
      }
    })
  }
  return staticTypeChoices
}

async function chooseStaticType(config: Configuration) {
  const choiceList: Choice[] = staticTypesFromConfig(config)

  if (choiceList.length === 0) {
    return
  }

  if (choiceList.length === 1) {
    return choiceList[0].value
  }

  const quit = {
    name: chalk.red(menuChoices.QUIT),
    value: menuChoices.QUIT,
    short: menuChoices.QUIT,
  }
  choiceList.push(quit)

  const questions = [{
    type: 'list',
    loop: false,
    message: 'Choose a ' +
      chalk.green('static type'),
    name: 'staticType',
    choices: choiceList,
  }]

  const answers: AnswersForStaticType = await inquirer.prompt(questions)
  return answers.staticType
}

export async function staticSettings(config: Configuration, nsInfo: NsInfo) {
  let staticType = await chooseStaticType(config)

  while (staticType) {
    if (staticType === menuChoices.QUIT) {
      console.log('finished...')
      return
    }

    await updateStaticTypeInstances(staticType, config, nsInfo)
    staticType = await chooseStaticType(config)
  }
}
