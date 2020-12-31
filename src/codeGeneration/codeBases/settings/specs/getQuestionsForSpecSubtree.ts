import {Specs, SpecSet} from '../../../../shared/constants/types/configuration'
import {ADD_NEW, AnswerValue, DELETE, DONE, EDIT, EDIT_OPTIONS, TO_EDIT, types} from '../types'
import {attention, exitOption, generalOption, progress, userValue} from '../../../../shared/constants/chalkColors'
import {extendedDescription} from './extendedDescription'
import {askForValue} from './askForValue'

const pluralize = require('pluralize')

interface SpecChoice {
    name: string;
    value: AnswerValue;
    short: string;
}

function answerForSpecificSubtype(
  name: string, specType: Specs, instanceInfo: any
) {
  const typeOfValue = specType.type
  const typeDescription = specType.description || ''
  if (!typeOfValue)
    throw new Error(`problem in config.  The spec type ${name} does not have a proper 'type' value. e.g. 'list' or 'set'.`)

  if (typeOfValue === types.LIST || typeOfValue === types.SET) {
    const required = specType.required || false
    const nameShown = `edit ${generalOption(pluralize(name))} [${extendedDescription(typeOfValue, typeDescription)}]`
    return {
      name: nameShown,
      value: {name, typeOfValue, required},
      short: name,
    }
  }
  const currentValue = instanceInfo || 'not set...'
  let displayedValue = currentValue
  if (typeof currentValue === 'string')
    displayedValue = currentValue.length < 40 ?
      currentValue :
      currentValue.substr(0, 35) + '...'
  let nameShown = `edit ${generalOption(name)} [${extendedDescription(typeOfValue, typeDescription)}]`
  if (specType.required) nameShown += attention('*')
  nameShown += ` value: ${userValue(displayedValue)}`
  return {
    name: nameShown,
    value: {name, typeOfValue},
    short: name,
  }
}

function getChoicesForSpecChildren(
  configSpecsSubtree: any,
  instanceSpecsSubtree: any,
  type: string,
) {
  let specChildrenChoices: SpecChoice[] = []

  if (type === types.LIST) {
    if (instanceSpecsSubtree) {
      instanceSpecsSubtree.map((instance: any, index: number) => {
        const name = instance.name || 'unnamed'
        const typeOfValue = types.SET
        specChildrenChoices.push({
          name: `edit ${generalOption(name)}`,
          value: {name, typeOfValue, required: false, index},
          short: name,
        })
      })
    }

    specChildrenChoices.push({
      name: progress('add new'),
      value: {name: ADD_NEW, typeOfValue: '', required: false},
      short: ADD_NEW,
    })
    specChildrenChoices.push({
      name: attention('delete'),
      value: {name: DELETE, typeOfValue: '', required: false},
      short: DELETE,
    })
    specChildrenChoices.push({
      name: exitOption(DONE),
      value: {name: DONE, typeOfValue: '', required: false},
      short: DONE,
    })

    return specChildrenChoices
  }

  if (configSpecsSubtree) {
    const subTypes = Object.keys(configSpecsSubtree)
    specChildrenChoices = subTypes.map((subTypeName: string) => {
      const configSpecsSubtreeElement = configSpecsSubtree[subTypeName]
      const instanceSpecsSubtreeElement = instanceSpecsSubtree[subTypeName]
      return answerForSpecificSubtype(
        subTypeName,
        configSpecsSubtreeElement,
        instanceSpecsSubtreeElement
      )
    })
  }

  specChildrenChoices.push({
    name: attention('delete'),
    value: {name: DELETE, typeOfValue: '', required: false},
    short: DELETE,
  })

  specChildrenChoices.push({
    name: exitOption(DONE),
    value: {name: DONE, typeOfValue: '', required: false},
    short: DONE,
  })

  // console.log(`** specChildrenChoices = ${JSON.stringify(specChildrenChoices, null, 1)}`)

  return specChildrenChoices
}

export function getQuestionsForSpecSubtree(
  specsForInstance: any,
  specsForType: Specs | SpecSet,
  type: string,
  currentName: string,
  required: boolean,
) {
  const questions = []

  if (type === types.TOP_LEVEL) {
    // there is no "contents" for a top level set
    questions.push({
      type: 'list',
      loop: false,
      message: `What would you like to edit for ${currentName}? ${attention('[*=required]')}`,
      name: TO_EDIT,
      choices: getChoicesForSpecChildren(
        specsForType, specsForInstance, type
      ),
    },)
    return questions
  }

  if (type === types.LIST || type === types.SET) {
    questions.push({
      type: 'list',
      loop: false,
      message: `What would you like to edit for ${currentName}? ${attention('[*=required]')}`,
      name: TO_EDIT,
      choices: getChoicesForSpecChildren(
        specsForType.contents, specsForInstance, type
      ),
    },)
    return questions
  }

  const editQuestion: any = askForValue(
    specsForInstance,
    // @ts-ignore
    specsForType,
    currentName,
    EDIT,
  )
  if (required) {
    questions.push(editQuestion)
  } else {
    editQuestion.when = function (answers: any) {
      return (answers[EDIT_OPTIONS] === 'edit')
    }
    questions.push({
      type: 'list',
      loop: false,
      message: `What would you like to do for ${currentName}?`,
      name: EDIT_OPTIONS,
      choices: [
        'edit',
        'delete',
      ],
    },
    editQuestion,)
  }

  return questions
}
