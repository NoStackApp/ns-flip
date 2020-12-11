import {types} from '../types'
import {askForValue} from './askForValue'
import {simpleValueEdit} from './simpleValueEdit'

const inquirer = require('inquirer')

interface NewSpecElementQuestion {
  type: string;
  name: string;
  message: string;
}

export async function addNewSpecElement(specsForInstance: any, specsForTypeContents: any) {
  console.log(`** in addNewSpecElement. specsForTypeContents = ${JSON.stringify(specsForTypeContents, null, 2)}`)
  console.log(`** in addNewSpecElement. specsForInstance = ${JSON.stringify(specsForTypeContents, null, 2)}`)

  const questions: NewSpecElementQuestion[] = []
  const subTypes = Object.keys(specsForTypeContents)
  subTypes.map((subType: string) => {
    const subTypeInfo = specsForTypeContents[subType]
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
    const subTypeInfo = specsForTypeContents[subType]
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
