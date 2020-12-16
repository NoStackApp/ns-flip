import {types} from '../types'
import {askForValue} from './askForValue'
import {simpleValueEdit} from './simpleValueEdit'
import {META_DELIMITER} from '../../../../shared/constants'
import {customLocationNewRegExString} from '../../../../shared/constants/Regex/regExNewCustomLocation'
import {regExAnswerValueString} from '../../../../shared/constants/Regex/regExAnswerValueString'

const inquirer = require('inquirer')

const regExAnswerValue = new RegExp(regExAnswerValueString, 'g')

interface NewSpecElementQuestion {
  type: string;
  name: string;
  message: string;
  validate?: Function;
}

function askQuestion(subTypeInfo: any, answers: any) {
  const subTypeInfoKeys = Object.keys(subTypeInfo)
  const returned = {...subTypeInfo}
  subTypeInfoKeys.map((key: string) => {
    const value = subTypeInfo[key]
    if ((typeof value) !== 'string') return

    returned[key] = value.replace(regExAnswerValueString, function (
      match: string,
      answerKey: string,
    ) {
      answers[answerKey]
    })
  })
  return returned
}

export async function createSpecElement(specsForTypeContents: any) {
  const questions: NewSpecElementQuestion[] = []
  const subTypes = Object.keys(specsForTypeContents)
  subTypes.map((subType: string) => {
    const subTypeInfo = specsForTypeContents[subType]
    const {type} = subTypeInfo
    if (type !== types.SET && type !== types.LIST) {
      questions.push(askForValue(
        null,
        subTypeInfo,
        subType,
        subType,
      ))
    }
  })
  const answers = await inquirer.prompt(questions)

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
