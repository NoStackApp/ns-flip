import {Specs, SpecSet} from '../../../../shared/constants/types/configuration'
import {getQuestionsForSpecSubtree} from './getQuestionsForSpecSubtree'
import {ADD_NEW, AnswersForStaticInstanceSpec, DONE, EDIT, EDIT_OPTIONS, TO_EDIT, types} from '../types'
import {addNewSpecElement} from './addNewSpecElement'
import {menuOption} from '../../../../shared/constants/chalkColors'

const inquirer = require('inquirer')
const editOptions = {
  DELETE: 'delete',
  EDIT: 'edit',
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

    if (answers[EDIT]) {
      // a simple value was provided.  Clearly not a list or set.
      if (type === 'boolean' && answers[EDIT] === 'true') {
        return true
      }
      if (type === 'boolean' && answers[EDIT] === 'false') {
        return false
      }

      return answers[EDIT]
    }

    if (answers[EDIT_OPTIONS]) {
      if (answers[EDIT_OPTIONS] === editOptions.DELETE) {
        return null
      }
    }

    if (answers[TO_EDIT].name === ADD_NEW) {
      if (!specsForInstance) specsForInstance = []
      // eslint-disable-next-line no-console
      console.log(`Answer the following questions to add a new entry to ${menuOption(currentName)}...`)
      specsForInstance = await addNewSpecElement(specsForInstance, specsForType)
      continue
    }

    if (answers[TO_EDIT] && type === types.LIST) {
      const {name, index} = answers[TO_EDIT]
      // @ts-ignore
      const specsForChildInstance = specsForInstance[index]
      const specsForChildType = {...specsForType}
      specsForChildType.type = types.SET

      specsForInstance[name] = await updateSpecSubtree(
        specsForChildInstance,
        specsForChildType,
        types.SET,
        currentName + '-->' + name,
        false,
      )
    }

    if (answers[TO_EDIT] && type === types.SET) {
      const {name, typeOfValue, required} = answers[TO_EDIT]

      const specsForChildInstance = specsForInstance[name]
      // @ts-ignore
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
