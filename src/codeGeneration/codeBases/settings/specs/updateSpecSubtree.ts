import {Specs, SpecSet} from '../../../../shared/constants/types/configuration'
import {getQuestionsForSpecSubtree} from './getQuestionsForSpecSubtree'
import {ADD_NEW, AnswersForStaticInstanceSpec, DELETE, DONE, EDIT, EDIT_OPTIONS, TO_EDIT, types} from '../types'
import {addNewSpecElement} from './addNewSpecElement'
import {menuOption} from '../../../../shared/constants/chalkColors'
import {simpleValueEdit} from './simpleValueEdit'

const inquirer = require('inquirer')
const editOptions = {
  DELETE: 'delete',
  EDIT: 'edit',
}

async function updateList(answers: AnswersForStaticInstanceSpec, specsForInstance: any, specsForType: Specs | SpecSet, currentName: string) {
  // in a list, the index is used rather than the name
  const {name, index} = answers[TO_EDIT]
  // @ts-ignore
  const specsForChildInstance = specsForInstance[index]
  const specsForChildType = {...specsForType}
  specsForChildType.type = types.SET

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const newSpecsForChildInstance = await updateSpecSubtree(
    specsForChildInstance,
    specsForChildType,
    types.SET,
    currentName + '-->' + name,
    false,
  )

  if (index) {
    if (newSpecsForChildInstance)
      specsForInstance[index] = newSpecsForChildInstance
    else {
      specsForInstance.splice(index, 1)
    }
  }
}

async function updateSet(answers: AnswersForStaticInstanceSpec, specsForInstance: any, specsForType: Specs | SpecSet, currentName: string) {
  const {name, typeOfValue, required} = answers[TO_EDIT]

  const specsForChildInstance = specsForInstance[name]
  // @ts-ignore
  const specsForChildType: Specs = specsForType.contents[name]

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  specsForInstance[name] = await updateSpecSubtree(
    specsForChildInstance,
    specsForChildType,
    typeOfValue,
    currentName + '-->' + name,
    required || false
  )
}

export async function updateSpecSubtree(
  specsForInstance: any,
  specsForType: Specs | SpecSet,
  type: string,
  currentName: string,
  required: boolean,
) {
  // console.log(`** in updateSpecSubtree specsForType=${JSON.stringify(specsForType)}`)

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const questions = getQuestionsForSpecSubtree(
      specsForInstance,
      specsForType,
      type,
      currentName,
      required)
    const answers: AnswersForStaticInstanceSpec = await inquirer.prompt(questions)

    if (answers[TO_EDIT] && answers[TO_EDIT].name === DONE) return specsForInstance
    if (answers[TO_EDIT] && answers[TO_EDIT].name === DELETE) return undefined

    if (answers[EDIT] !== undefined) return simpleValueEdit(type, answers[EDIT])

    if (answers[EDIT_OPTIONS] && answers[EDIT_OPTIONS] === editOptions.DELETE)
      return null

    if (answers[TO_EDIT].name === ADD_NEW) {
      if (!specsForInstance) specsForInstance = []
      // eslint-disable-next-line no-console
      console.log(`Answer the following questions to add a new entry to ${menuOption(currentName)}...`)
      specsForInstance = await addNewSpecElement(specsForInstance, specsForType)
      continue
    }

    if (answers[TO_EDIT] && type === types.LIST) {
      await updateList(answers, specsForInstance, specsForType, currentName)
    }

    if (answers[TO_EDIT] && type === types.SET) {
      await updateSet(answers, specsForInstance, specsForType, currentName)
    }
  }
}
