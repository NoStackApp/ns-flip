import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import {Choice} from './settingsTypes'
import {menuChoices} from '../../../shared/constants'
const inquirer = require('inquirer')

const chalk = require('chalk')

interface AnswersForStaticInstance {
  staticInstance: string;
}

function staticInstancesFromNsInfo(staticType: string, nsInfo: NsInfo) {
  if (!nsInfo.static) nsInfo.static = {}

  const staticInfo = nsInfo.static
  const staticInstances = staticInfo[staticType]

  const addNew = {
    name: chalk.greenBright(`Add new instance of ${staticType}`),
    value: menuChoices.ADD_NEW,
    short: menuChoices.ADD_NEW,
  }

  const quit = {
    name: chalk.red('done'),
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
    message: 'Choose a ' +
      chalk.green('static instance') +
      'to edit, or add a new one.',
    name: 'staticType',
    choices: choiceList,
  }]

  const answers: AnswersForStaticInstance = await inquirer.prompt(questions)
  return answers.staticInstance
}

async function addStaticInstance(staticType: string, nsInfo: NsInfo) {
  console.log('in add status instance...')
  const addInstanceQuestions = [
    {
      type: 'input',
      name: 'name',
      message: `What's the name of the instance of ${staticType}?`,
    },
    {
      type: 'input',
      name: 'slug',
      message: "What's the slug?  (It will get inserted into things like file names.)",
    },
  ]

  inquirer.prompt(addInstanceQuestions).then((answers: any) => {
    console.log(JSON.stringify(answers, null, '  '))
  })
}

export async function updateStaticTypeInstances(
  staticType: string,
  config: Configuration,
  nsInfo: NsInfo) {
  console.log(`Update the instances for static type ${staticType}.`)

  const staticTypes = config.static
  const typeDescription = staticTypes[staticType].description
  console.log(chalk.green(typeDescription))

  let staticInstance = await chooseStaticInstance(staticType, nsInfo)

  while (staticInstance) {
    if (staticInstance === menuChoices.QUIT) {
      console.log('finished...')
      return
    }

    if (staticInstance === menuChoices.ADD_NEW) {
      await addStaticInstance(staticType, nsInfo)
    }

    if (staticInstance !== menuChoices.ADD_NEW) {
      console.log(`instance to edit = ${staticInstance}`)
    }

    await updateStaticTypeInstances(staticInstance, config, nsInfo)
    staticInstance = await chooseStaticInstance(staticType, nsInfo)
  }
}
