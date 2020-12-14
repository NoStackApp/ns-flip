import {createSpecElement} from './createSpecElement'

interface NewSpecElementQuestion {
  type: string;
  name: string;
  message: string;
}

export async function addNewSpecElement(specsForInstance: any, specsForTypeContents: any) {
  specsForInstance.puch(await createSpecElement(specsForTypeContents))
}
