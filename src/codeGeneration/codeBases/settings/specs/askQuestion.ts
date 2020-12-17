import {askForValue} from './askForValue'
import {replaceGlobalValuesInObject} from './replaceGlobalValuesInObject'

const inquirer = require('inquirer')

export async function askQuestion(
  subTypeInfo: any,
  subType: string,
  answers: any,
  session: any = {},
) {
  const questionKeys = replaceGlobalValuesInObject(subTypeInfo, session, answers)
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
