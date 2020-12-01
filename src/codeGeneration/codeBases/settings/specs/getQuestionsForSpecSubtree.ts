import {Specs, SpecSet} from '../../../../shared/constants/types/configuration'
import {ADD_NEW, AnswerValue, DONE, EDIT, EDIT_OPTIONS, TO_EDIT, types} from '../types'
import * as chalk from 'chalk'

const pluralize = require('pluralize')

interface SpecChoice {
    name: string;
    value: AnswerValue;
    short: string;
}

function answerForSpecificSubtype(name: string, specType: Specs, instanceInfo: any) {
  // console.log(`** in answerForSpecificSubtype for ${name}.  specType = ${JSON.stringify(specType)}.  instanceInfo=${instanceInfo}`)
  const typeOfValue = specType.type
  if (!typeOfValue) throw new Error(`problem in config.  The spec type ${name} does not have a proper 'type' value. e.g. 'list' or 'set'.`)
  // console.log(`** in answerForSpecificSubtype for ${name}.  typeOfValue = ${typeOfValue}`)
  if (typeOfValue === types.LIST || typeOfValue === types.SET) {
    const required = specType.required || false
    let nameShown = `edit ${chalk.blueBright(pluralize(name))}`
    if (required) nameShown += chalk.red('*')
    return {
      name: nameShown,
      value: {name, typeOfValue, required},
      short: name,
    }
  }
  const currentValue = instanceInfo || 'not set...'
  const displayedValue = currentValue.length < 40 ? currentValue : currentValue.substr(0, 35) + '...'
  let nameShown = `edit ${chalk.blueBright(name)}: value: ${chalk.green(displayedValue)}`
  if (specType.required) nameShown += chalk.red('*')
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
  // console.log(`** in getChoicesForSpecChildren, type = ${type}`)
  // console.log(`** in getChoicesForSpecChildren, configSpecsSubtree = ${JSON.stringify(configSpecsSubtree, null, 2)}`)
  // console.log(`** in getChoicesForSpecChildren, instanceSpecsSubtree = ${JSON.stringify(instanceSpecsSubtree, null, 2)}`)
  let specChildrenChoices: SpecChoice[] = []

  if (type === types.LIST) {
    if (instanceSpecsSubtree) {
      instanceSpecsSubtree.map((instance: any, index: number) => {
        const name = instance.name || 'unnamed'
        const typeOfValue = types.SET
        specChildrenChoices.push({
          name: `edit ${chalk.blueBright(name)}`,
          value: {name, typeOfValue, required: false, index},
          short: name,
        })
      })
    }

    specChildrenChoices.push({
      name: chalk.greenBright('Add New'),
      value: {name: ADD_NEW, typeOfValue: '', required: false},
      short: ADD_NEW,
    })
    specChildrenChoices.push({
      name: chalk.red(DONE),
      value: {name: DONE, typeOfValue: '', required: false},
      short: DONE,
    })

    return specChildrenChoices
  }

  if (configSpecsSubtree) {
    const subTypes = Object.keys(configSpecsSubtree)
    specChildrenChoices = subTypes.map((subTypeName: string) => {
      // console.log(`** subTypeName= ${subTypeName}`)
      const configSpecsSubtreeElement = configSpecsSubtree[subTypeName]
      // console.log(`** configSpecsSubtreeElement= ${JSON.stringify(configSpecsSubtreeElement, null, 1)}`)
      const instanceSpecsSubtreeElement = instanceSpecsSubtree[subTypeName]
      // console.log(`** instanceSpecsSubtreeElement= ${JSON.stringify(instanceSpecsSubtreeElement, null, 1)}`)
      return answerForSpecificSubtype(
        subTypeName,
        configSpecsSubtreeElement,
        instanceSpecsSubtreeElement
      )
    })
    // console.log(`** specChildrenChoices = ${JSON.stringify(specChildrenChoices, null, 2)}`)
  }

  specChildrenChoices.push({
    name: chalk.red(DONE),
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

  if (type === types.LIST || type === types.SET) {
    questions.push(
      {
        type: 'list',
        loop: false,
        message: `What would you like to edit for ${currentName}? ${chalk.red('[*=required]')}`,
        name: TO_EDIT,
        choices: getChoicesForSpecChildren(specsForType.contents, specsForInstance, type),
      },
    )
    return questions
  }

  if (required) {
    questions.push(
      {
        type: 'list',
        loop: false,
        message: `What would you like to do for ${currentName}?`,
        name: EDIT_OPTIONS,
        choices: ['edit', 'delete'],
      },
      {
        type: 'input',
        name: EDIT,
        message: `What should the value of ${currentName} be?`,
        default: specsForInstance,
        when: function (answers: any) {
          return (answers[EDIT_OPTIONS] === 'edit')
        },
      },
    )
  } else {
    questions.push(
      {
        type: 'input',
        name: EDIT,
        message: `What should the value of ${currentName} be?`,
        default: specsForInstance,
      },
    )
  }

  return questions
}
