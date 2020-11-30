import {types} from './types'

const inquirer = require('inquirer')

interface NewSpecElementQuestion {
  type: string;
  name: string;
  message: string;
}

export async function addNewSpecElement(specsForInstance: any, specsForType: any) {
  console.log(`** in addNewSpecElement. specsForType.contents = ${JSON.stringify(specsForType.contents, null, 2)}`)

  const questions: NewSpecElementQuestion[] = []
  const subTypes = Object.keys(specsForType.contents)
  subTypes.map((subType: string) => {
    const subTypeInfo = specsForType.contents[subType]
    const type = subTypeInfo.type
    if (type !== types.SET && type !== types.LIST) {
      questions.push({
        type: 'input',
        name: subType,
        message: `What is the ${subType} [type ${type}]?`,
      })
    }
  })
  const answers = await inquirer.prompt(questions)
  console.log(`answers=${JSON.stringify(answers)}`)
  specsForInstance.push(answers)
  return specsForInstance
}
