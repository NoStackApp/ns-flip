import {Schema} from '../../shared/constants/types/schema'

const highestLevel = 'highestLevel'
import {buildSelectionTree} from './buildSelectionTree'
import {createSelectedRoot} from './createSelectedRoot'

export const setSelectionRoots = (stack: Schema) => {
  let i

  const units = stack.sources
  const unitKeys = Object.keys(units)
  // console.log(`&& unitKeys = ${JSON.stringify(unitKeys, null, 1)}`);
  for (i = 0; i < unitKeys.length; i++) {
    let unitInfo = units[unitKeys[i]]
    const selectedTree = unitInfo.selectedTree

    // create the selectedTree
    const selectionTypes = unitInfo.selections
    // console.log(`&& selectionTypes = ${selectionTypes}`);
    let j
    for (j = 0; j < selectionTypes.length; j++) {
      const selection = selectionTypes[j]
      selectedTree[selection] = []
    }
    // console.log(`&& selectedTree = ${JSON.stringify(selectedTree)}`)
    if (!unitInfo.root) throw new Error(`no root for unit ${unitKeys[i]}`)
    unitInfo = buildSelectionTree(unitInfo.root, highestLevel, unitInfo)
    unitInfo = createSelectedRoot(unitInfo)
  }

  return stack
}
