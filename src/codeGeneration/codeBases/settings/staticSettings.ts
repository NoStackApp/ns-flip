import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import {updateStaticTypeInstances} from './updateStaticTypeInstances'
import {menuChoices} from '../../../shared/constants'
import {Choice} from './settingsTypes'

const chalk = require('chalk')
const inquirer = require('inquirer')

const TYPE = 'staticType'
interface AnswersForStaticType {
  [TYPE]: string;
}

function staticTypesFromConfig(config: Configuration) {
  const staticTypes = config.static

  let staticTypeChoices: Choice[] = []
  if (staticTypes) {
    const types = Object.keys(staticTypes)
    staticTypeChoices = types.map((typeName: string) => {
      return {
        name: chalk.blueBright(typeName) + ': ' + staticTypes[typeName].description,
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
    message: `Updating Static Instances.  Choose a ${chalk.blueBright('static type')}.`,
    name: TYPE,
    choices: choiceList,
  }]

  const answers: AnswersForStaticType = await inquirer.prompt(questions)
  return answers.staticType
}

export async function staticSettings(config: Configuration, nsInfo: NsInfo, codeDir: string) {
  let staticType = await chooseStaticType(config)
  // console.log(`** staticType at the beginning of staticSettings while = ${staticType}`)

  while (staticType) {
    if (staticType === menuChoices.QUIT) {
      // eslint-disable-next-line no-console
      console.log('Finished updating static types...')
      return
    }

    await updateStaticTypeInstances(staticType, config, nsInfo, codeDir)
    staticType = await chooseStaticType(config)
    // console.log(`** staticType at the end of staticSettings while = ${staticType}`)
  }
}
