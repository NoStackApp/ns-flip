import {types} from '../types'
import {simpleValueEdit} from './simpleValueEdit'
import {regExObjectValueString} from '../../../../shared/constants/Regex/regExObjectValueString'
import {askForValue} from './askForValue'

const inquirer = require('inquirer')

const regExObjectValue = new RegExp(regExObjectValueString, 'g')

interface NewSpecElementQuestion {
  type: string;
  name: string;
  message: string;
  validate?: Function;
}

const globalObjects = {
  SETTINGS: 'nsInfo',
  ANSWERS: 'answers',
  SESSION: 'session',
  CONFIG: 'config',
}

async function askQuestion(
  subTypeInfo: any,
  subType: string,
  answers: any,
  session: any = {},
) {
  const subTypeInfoKeys = Object.keys(subTypeInfo)
  const questionKeys = {...subTypeInfo}
  subTypeInfoKeys.map((key: string) => {
    const value = subTypeInfo[key]
    if ((typeof value) !== 'string') return

    questionKeys[key] = value.replace(regExObjectValue, function (
      match: string,
      objectName: string,
      key: string,
    ) {
      if (objectName === globalObjects.ANSWERS) return answers[key]
      if (objectName === globalObjects.SESSION) return session[key]
      // if (objectName === globalObjects.SETTINGS) return nsInfo[key]
    })
  })
  const questions = [
    askForValue(
      null,
      questionKeys,
      subType,
      subType,
    ),
  ]

  const theseAnswers = await inquirer.prompt(questions)
  answers = {...answers, ...theseAnswers}
  return answers
}

export async function createSpecElement(specsForTypeContents: any, session: any = {}) {
  // const questions: NewSpecElementQuestion[] = []
  const subTypes = Object.keys(specsForTypeContents)
  // subTypes.map((subType: string) => {
  //   const subTypeInfo = specsForTypeContents[subType]
  //   const {type} = subTypeInfo
  //   if (type !== types.SET && type !== types.LIST) {
  //     questions.push(askForValue(
  //       null,
  //       subTypeInfo,
  //       subType,
  //       subType,
  //     ))
  //   }
  // })
  // const answers = await inquirer.prompt(questions)
  let answers: any = {}
  let i
  for (i = 0; i < subTypes.length; i++) {
    const subType = subTypes[i]
    const subTypeInfo = specsForTypeContents[subType]
    const {type} = subTypeInfo
    if (type !== types.SET && type !== types.LIST) {
      // eslint-disable-next-line require-atomic-updates
      answers = await askQuestion(subTypeInfo, subType, answers, session)
    }
  }

  Object.keys(answers).forEach(key => {
    if (answers[key] === '') delete answers[key]
  })

  subTypes.map((subType: string) => {
    const subTypeInfo = specsForTypeContents[subType]
    const type = subTypeInfo.type
    if (answers[subType] === '' || answers[subType] === undefined) {
      delete answers[subType]
      return
    }

    answers[subType] = simpleValueEdit(type, answers[subType])
  })

  return answers
}
