import {types} from '../types'
import {askForValue} from './askForValue'
import {simpleValueEdit} from './simpleValueEdit'
import {createSpecElement} from './createSpecElement'

const inquirer = require('inquirer')

interface NewSpecElementQuestion {
  type: string;
  name: string;
  message: string;
}

export async function addNewSpecElement(specsForInstance: any, specsForTypeContents: any) {
  console.log(`** in addNewSpecElement. specsForInstance = ${JSON.stringify(specsForTypeContents, null, 2)}`)

  specsForInstance.puch(await createSpecElement(specsForTypeContents))
}
