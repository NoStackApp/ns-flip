import {Configuration} from '../../../../shared/constants/types/configuration'
import {NsInfo} from '../../../../shared/constants/types/nsInfo'
import {setNsInfo} from '../../../../shared/nsFiles/setNsInfo'

import {updateInstanceSpecs} from '../specs/updateInstanceSpecs'
import {attention, exitOption, generalOption, statusUpdate} from '../../../../shared/constants/chalkColors'

const inquirer = require('inquirer')

const actionTypes = {
  RENAME: 'rename',
  UPDATE_SPECS: 'updateSpecs',
  DELETE: 'delete',
  BACK: 'back',
}

interface AnswersForUpdateInstance {
  action: string;
  name: string;
  slug: string;
}

const ACTION = 'action'
const NAME = 'name'
const SLUG = 'slug'
// const SPECS = 'specs'

interface AnswersForUpdateInstance {
  action: string;
  name: string;
  slug: string;
  specs: string;
}

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
      name: ACTION,
      choices: [
        generalOption(actionTypes.RENAME),
        generalOption(actionTypes.UPDATE_SPECS),
        attention(actionTypes.DELETE),
        exitOption(actionTypes.BACK),
      ],
    },
    {
      type: 'input',
      name: NAME,
      message: 'What should the name be?',
      default: instanceName,
      when: function (answers: AnswersForUpdateInstance) {
        return (answers.action === generalOption(actionTypes.RENAME))
      },
    },
    {
      type: 'input',
      name: SLUG,
      message: 'What should the slug be?',
      default: instanceInfo.slug,
      when: function (answers: AnswersForUpdateInstance) {
        return answers.action === generalOption(actionTypes.RENAME)
      },
    },
  ]

  const answers: AnswersForUpdateInstance = await inquirer.prompt(questions)

  while (answers[ACTION]) {
    const actionType = answers[ACTION]
    if (actionType === exitOption(actionTypes.BACK)) {
      // eslint-disable-next-line no-console
      console.log(statusUpdate(`finished updating ${staticType}...`))
      return
    }

    if (actionType === attention(actionTypes.DELETE)) {
      delete nsInfo.static[staticType][instanceName]
      await setNsInfo(codeDir, nsInfo)
      // eslint-disable-next-line no-console
      console.log(statusUpdate(`${instanceName} deleted...`))
      return
    }

    if (actionType === generalOption(actionTypes.RENAME)) {
      if (instanceName !== answers[NAME]) {
        nsInfo.static[staticType][answers[NAME]] = {...instanceInfo}
        delete nsInfo.static[staticType][instanceName]
      }

      nsInfo.static[staticType][answers[NAME]].slug = answers[SLUG]
      await setNsInfo(codeDir, nsInfo)
      // eslint-disable-next-line no-console
      console.log(statusUpdate(`${instanceName} updated...`))
      return
    }

    await updateInstanceSpecs(staticType, instanceName, config, nsInfo, codeDir)
    return
  }
}
