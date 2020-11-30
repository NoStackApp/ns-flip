import {Configuration, Specs, SpecSet} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import * as chalk from 'chalk'
import {setNsInfo} from '../../../shared/nsFiles/setNsInfo'
import {addNewSpecElement} from './addNewSpecElement'
import {types} from './types'

const inquirer = require('inquirer')

const pluralize = require('pluralize')
const DONE = 'done'
const ADD_NEW = 'addNew'

const editOptions = {
  DELETE: 'delete',
  EDIT: 'edit',
}

interface AnswerValue {
  name: string;
  typeOfValue: string;
  required?: boolean;
  index?: number;
}

interface SpecChoice {
  name: string;
  value: AnswerValue;
  short: string;
}

const TO_EDIT = 'toEdit'
const EDIT_OPTIONS = 'editOptions'
const EDIT = 'edit'

interface AnswersForStaticInstanceSpec {
  'toEdit': AnswerValue;
  'editOptions': any;
  'edit': any;
}

function answerForSpecificSubtype(name: string, specType: Specs, instanceInfo: any) {
  console.log(`** in answerForSpecificSubtype for ${name}.  specType = ${JSON.stringify(specType)}.  instanceInfo=${instanceInfo}`)
  const typeOfValue = specType.type
  if (!typeOfValue) throw new Error(`problem in config.  The spec type ${name} does not have a proper 'type' value. e.g. 'list' or 'set'.`)
  console.log(`** in answerForSpecificSubtype for ${name}.  typeOfValue = ${typeOfValue}`)
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
  console.log(`** in getChoicesForSpecChildren, type = ${type}`)
  console.log(`** in getChoicesForSpecChildren, configSpecsSubtree = ${JSON.stringify(configSpecsSubtree, null, 2)}`)
  console.log(`** in getChoicesForSpecChildren, instanceSpecsSubtree = ${JSON.stringify(instanceSpecsSubtree, null, 2)}`)
  let specChildrenChoices: SpecChoice[] = []

  if (type === types.LIST) {
    instanceSpecsSubtree.map((instance: any, index: number) => {
      const name = instance.name || 'unnamed'
      const typeOfValue = types.SET
      specChildrenChoices.push({
        name: `edit ${chalk.blueBright(name)}`,
        value: {name, typeOfValue, required: false, index},
        short: name,
      })
    })

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
      console.log(`** subTypeName= ${subTypeName}`)
      const configSpecsSubtreeElement = configSpecsSubtree[subTypeName]
      console.log(`** configSpecsSubtreeElement= ${JSON.stringify(configSpecsSubtreeElement, null, 1)}`)
      const instanceSpecsSubtreeElement = instanceSpecsSubtree[subTypeName]
      console.log(`** instanceSpecsSubtreeElement= ${JSON.stringify(instanceSpecsSubtreeElement, null, 1)}`)
      return answerForSpecificSubtype(
        subTypeName,
        configSpecsSubtreeElement,
        instanceSpecsSubtreeElement
      )
    })
    console.log(`** specChildrenChoices = ${JSON.stringify(specChildrenChoices, null, 2)}`)
  }

  specChildrenChoices.push({
    name: chalk.red(DONE),
    value: {name: DONE, typeOfValue: '', required: false},
    short: DONE,
  })

  console.log(`** specChildrenChoices = ${JSON.stringify(specChildrenChoices, null, 1)}`)

  return specChildrenChoices
}

function getQuestionsForSpecSubtree(
  specsForInstance: any,
  specsForType: Specs | SpecSet,
  type: string,
  currentName: string,
  required: boolean,
) {
  console.log(` in getQuestionsForSpecSubtree.  specsForType=${JSON.stringify(specsForType, null, 1)}`)
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
        message: `What value would you like to do for ${type}?`,
        name: EDIT_OPTIONS,
        choices: ['edit', 'delete'],
      },
      {
        type: 'input',
        name: EDIT,
        message: 'What should the name be?',
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
        message: 'What should the name be?',
        default: specsForInstance,
      },
    )
  }

  return questions
}

async function updateSpecSubtree(
  specsForInstance: any,
  specsForType: Specs | SpecSet,
  type: string,
  currentName: string,
  required: boolean,
) {
  console.log(`** in updateSpecSubtree specsForType=${JSON.stringify(specsForType)}`)

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const questions = getQuestionsForSpecSubtree(
      specsForInstance,
      specsForType,
      type,
      currentName,
      required)
    const answers: AnswersForStaticInstanceSpec = await inquirer.prompt(questions)

    console.log(`** questions=${JSON.stringify(questions, null, 1)}`)
    console.log(`** answers=${JSON.stringify(answers, null, 1)}`)

    if (answers[TO_EDIT] && answers[TO_EDIT].name === DONE) return specsForInstance

    if (answers[EDIT]) return answers[EDIT]

    if (answers[EDIT_OPTIONS]) {
      if (answers[EDIT_OPTIONS] === editOptions.DELETE) {
        return null
      }
    }

    if (answers[TO_EDIT].name === ADD_NEW) {
      specsForInstance = await addNewSpecElement(specsForInstance, specsForType)
      console.log(`after adding, specsForInstance=${JSON.stringify(specsForInstance, null, 1)}`)
      continue
    }

    if (answers[TO_EDIT] && type === types.LIST) {
      console.log('this is a list!')
      const {name, index} = answers[TO_EDIT]
      const specsForChildInstance = specsForInstance[index]
      const specsForChildType = {...specsForType, type: types.SET}
      console.log(`specsForChildInstance=${JSON.stringify(specsForChildInstance)}`)
      // @ts-ignore

      specsForInstance[name] = await updateSpecSubtree(
        specsForChildInstance,
        specsForChildType,
        types.SET,
        currentName + '-->' + name,
        false,
      )
    }

    if (answers[TO_EDIT] && type === types.SET) {
      console.log(`in the editing for a particular option....answers[TO_EDIT]=${JSON.stringify(answers[TO_EDIT])}`)
      const {name, typeOfValue, required} = answers[TO_EDIT]
      console.log(`name=${name} specsForType=${JSON.stringify(specsForType, null, 2)}`)
      console.log(`specsForInstance=${JSON.stringify(specsForInstance, null, 2)}`)

      const specsForChildInstance = specsForInstance[name]
      const specsForChildType: Specs = specsForType.contents[name]

      // @ts-ignore
      specsForInstance[name] = await updateSpecSubtree(
        specsForChildInstance,
        specsForChildType,
        typeOfValue,
        currentName + '-->' + name,
        required || false
      )
    }
  }
}

export async function updateInstanceSpecs(
  staticType: string,
  instanceName: string,
  config: Configuration,
  nsInfo: NsInfo,
  codeDir: string,
) {
  const specsForType = {
    type: 'set',
    required: true,
    contents: config.static[staticType].specs,
  }

  if (!nsInfo.static) return
  const specsForInstance = nsInfo.static[staticType][instanceName].specs

  try {
    nsInfo.static[staticType][instanceName].specs =
      await updateSpecSubtree(
        specsForInstance,
        specsForType,
        types.SET,
        instanceName,
        true,
      )
    await setNsInfo(codeDir, nsInfo)
  } catch (error) {
    console.log(error)
    throw new Error(`problem updating specs: ${error}`)
  }
}
