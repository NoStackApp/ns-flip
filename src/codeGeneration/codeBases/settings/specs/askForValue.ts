import {extendedDescription} from './extendedDescription'

export function askForValue(
  specsForInstance: any,
  type: string,
  currentName: string,
  questionName: string,
  defaultAnswer: string|number|boolean,
  description: string|undefined,
) {
  const name = questionName
  const fullDescription = extendedDescription(type, description)
  if (type === 'boolean') {
    return {
      type: 'confirm',
      name,
      message: `is ${currentName} true? [${fullDescription}]`,
      default: defaultAnswer,
    }
  }
  return {
    type: 'input',
    name,
    message: `Value of ${currentName} [${fullDescription}]`,
    default: defaultAnswer,
  }
}
