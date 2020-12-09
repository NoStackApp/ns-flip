import {types} from '../types'
import {askForValue} from './askForValue'
import {simpleValueEdit} from './simpleValueEdit'

const inquirer = require('inquirer')

interface NewSpecElementQuestion {
  type: string;
  name: string;
  message: string;
}

export async function addNewSpecElement(specsForInstance: any, specsForType: any) {
  // console.log(`** in addNewSpecElement. specsForType.contents = ${JSON.stringify(specsForType.contents, null, 2)}`)

  const questions: NewSpecElementQuestion[] = []
  const subTypes = Object.keys(specsForType.contents)
  subTypes.map((subType: string) => {
    const subTypeInfo = specsForType.contents[subType]
    const type = subTypeInfo.type
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
    const subTypeInfo = specsForType.contents[subType]
    const type = subTypeInfo.type
    if (answers[subType] === '' || answers[subType] === undefined) {
      delete answers[subType]
      return
    }

    answers[subType] = simpleValueEdit(type, answers[subType])
  })

  specsForInstance.push(answers)
  return specsForInstance
}
