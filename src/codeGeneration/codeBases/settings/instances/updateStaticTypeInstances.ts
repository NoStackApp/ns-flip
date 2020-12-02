import {Configuration} from '../../../../shared/constants/types/configuration'
import {NsInfo} from '../../../../shared/constants/types/nsInfo'
import {Choice} from '../settingsTypes'
import {ADD_NEW_VALUE, menuChoices} from '../../../../shared/constants'
import {addStaticInstance} from './addStaticInstance'
import {updateStaticInstance} from './updateStaticInstance'
import {exitOption, progress, statusUpdate} from '../../../../shared/constants/chalkColors'

const inquirer = require('inquirer')

const chalk = require('chalk')

const INSTANCE = 'staticInstance'

interface AnswersForStaticInstance {
  [INSTANCE]: string;
}

function staticInstancesFromNsInfo(staticType: string, nsInfo: NsInfo) {
  if (!nsInfo.static) nsInfo.static = {}

  const staticInfo = nsInfo.static
  const staticInstances = staticInfo[staticType]

  const addNew = {
    name: progress(`Add new instance of ${staticType}`),
    value: ADD_NEW_VALUE,
    short: menuChoices.ADD_NEW,
  }

  const quit = {
    name: exitOption('done'),
    value: menuChoices.QUIT,
    short: 'done',
  }

  let staticInstanceChoices: Choice[] = []
  if (staticInstances) {
    const instances = Object.keys(staticInstances)
    staticInstanceChoices = instances.map((typeName: string) => {
      return {
        name: chalk.blueBright(typeName),
        value: typeName,
        short: typeName,
      }
    })
  }

  staticInstanceChoices.push(addNew)
  staticInstanceChoices.push(quit)
  return staticInstanceChoices
}

async function chooseStaticInstance(staticType: string, nsInfo: NsInfo) {
  const choiceList: Choice[] = staticInstancesFromNsInfo(staticType, nsInfo)

  const questions = [{
    type: 'list',
    loop: false,
    message: `Choose a ${chalk.blueBright(staticType)} to edit, or ${chalk.greenBright('add a new one')}...`,
    name: INSTANCE,
    choices: choiceList,
  }]

  const answers: AnswersForStaticInstance = await inquirer.prompt(questions)
  // console.log(`** answers for static instance=${JSON.stringify(answers)}`)
  return answers.staticInstance
}

export async function updateStaticTypeInstances(
  staticType: string,
  config: Configuration,
  nsInfo: NsInfo,
  codeDir: string,
) {
  // eslint-disable-next-line no-console
  console.log(`Update the instances for static type ${staticType}.`)

  const staticTypes = config.static
  // // console.log(`**staticTypes[staticType]: ${JSON.stringify(staticTypes[staticType], null, ' ')}.`)
  const typeDescription = staticTypes[staticType].description
  // eslint-disable-next-line no-console
  console.log(chalk.green(typeDescription))

  let staticInstance = await chooseStaticInstance(staticType, nsInfo)
  // console.log(`** staticInstance=${staticInstance}`)

  while (staticInstance) {
    if (staticInstance === menuChoices.QUIT) {
      // eslint-disable-next-line no-console
      console.log(statusUpdate(`Finished updating ${staticType}...`))
      return
    }

    if (staticInstance === ADD_NEW_VALUE) {
      await addStaticInstance(staticType, config, nsInfo, codeDir)
    }

    if (staticInstance !== ADD_NEW_VALUE) {
      // console.log(`** instance to edit = ${staticInstance}`)
      await updateStaticInstance(
        staticType,
        staticInstance,
        config,
        nsInfo,
        codeDir
      )
    }

    staticInstance = await chooseStaticInstance(staticType, nsInfo)
  }
}
