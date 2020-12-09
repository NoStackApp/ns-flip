import {extendedDescription} from './extendedDescription'
import {Specs} from '../../../../shared/constants/types/configuration'
import {attention} from '../../../../shared/constants/chalkColors'

export function askForValue(
  specsForInstance: any,
  specsForType: Specs,
  currentName: string,
  questionName: string,
) {
  const name = questionName
  const {type, description, choices, required} = specsForType
  const defaultAnswer = specsForInstance || specsForType.default
  let fullDescription = '[' + extendedDescription(type, description) + ']'
  if (required) fullDescription += attention('*')
  if (type === 'boolean') {
    return {
      type: 'confirm',
      name,
      message: `is ${currentName} true? ${fullDescription}`,
      default: defaultAnswer,
    }
  }
  if (choices) {
    return {
      type: 'list',
      name,
      message: `choose value of ${currentName} ${fullDescription}`,
      choices,
      default: defaultAnswer,
    }
  }
  return {
    type: 'input',
    name,
    message: `enter value of ${currentName} ${fullDescription}`,
    default: defaultAnswer,
  }
}
