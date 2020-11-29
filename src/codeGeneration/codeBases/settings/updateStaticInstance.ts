import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import * as chalk from 'chalk'
import {setNsInfo} from '../../../shared/nsFiles/setNsInfo'
import {staticInstanceSpecs} from './staticInstanceSpecs'

const inquirer = require('inquirer')

const actionTypes = {
  RENAME: 'rename',
  SPECS: 'specs',
  DELETE: 'delete',
  BACK: 'back',
}

interface AnswersForUpdateInstance {
  action: string;
  name: string;
  slug: string;
}

const questionNames = {
  ACTION: 'action',
  NAME: 'name',
  SLUG: 'slug',
}
const ACTION = 'action'
const NAME = 'name'
const SLUG = 'slug'
const SPECS = 'specs'

interface AnswersForUpdateInstance {
  action: string;
  name: string;
  slug: string;
  specs: string;
}

// interface AnswersForUpdateInstance {
//   [ACTION]: string;
//   [questionNames.NAME]: string;
//   [questionNames.SLUG]: string;
// }

export async function updateStaticInstance(
  staticType: string,
  instanceName: string,
  config: Configuration,
  nsInfo: NsInfo,
  codeDir: string,
) {
  if (!nsInfo.static ||
    !nsInfo.static[staticType] ||
    !nsInfo.static[staticType][instanceName]
  ) throw new Error(`attempt to edit nonexistent static instance ${instanceName}.`)

  const instanceInfo = nsInfo.static[staticType][instanceName]

  const questions = [
    {
      type: 'list',
      loop: false,
      message: `What would you like to do with ${instanceName}?`,
      name: questionNames.ACTION,
      choices: [actionTypes.UPDATE, actionTypes.DELETE, actionTypes.BACK],
    },
    {
      type: 'input',
      name: questionNames.NAME,
      message: 'What should the name be?',
      default: instanceName,
      when: function (answers: AnswersForUpdateInstance) {
        return (answers.action === actionTypes.RENAME)
      },
    },
    {
      type: 'input',
      name: questionNames.SLUG,
      message: 'What should the slug be?',
      default: instanceInfo.slug,
      when: function (answers: AnswersForUpdateInstance) {
        return answers.action === actionTypes.RENAME
      },
    },
  ]

  const answers: AnswersForUpdateInstance = await inquirer.prompt(questions)

  const actionType = answers[ACTION]
  if (actionType === actionTypes.BACK) {
    // eslint-disable-next-line no-console
    console.log(`cancelled update to ${staticType}...`)
    return
  }

  if (actionType === actionTypes.DELETE) {
    delete nsInfo.static[staticType][instanceName]
    setNsInfo(codeDir, nsInfo)
    // eslint-disable-next-line no-console
    console.log(chalk.red(`${instanceName} deleted...`))
    return
  }

  if (actionType === actionTypes.SPECS) {
    await staticInstanceSpecs()
    // eslint-disable-next-line no-console
    console.log(chalk.red(`${instanceName} specs updated...`))
  }

  // perform update
  if (instanceName !== answers[NAME]) {
    nsInfo.static[staticType][answers[NAME]] = {...instanceInfo}
    delete nsInfo.static[staticType][instanceName]
  }

  nsInfo.static[staticType][answers[NAME]].slug = answers[SLUG]
  setNsInfo(codeDir, nsInfo)
  // eslint-disable-next-line no-console
  console.log(chalk.red(`${instanceName} updated...`))
}
