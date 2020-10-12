import {SourceInfo} from '../../constants/types/schema'

export function createSelectedRoot(unitInfo: SourceInfo) {
  const highestLevel = 'highestLevel'
  const selectedTree = {...unitInfo.selectedTree}
  const highestLevelList = selectedTree[highestLevel]
  let selectionRoot = highestLevelList[0]
  const root = unitInfo.root
  if (root && highestLevelList.length > 1) {
    // selectedTree[root] = highestLevelList;
    // unitInfo.selectedTree[root] = highestLevelList
    selectionRoot = root
  }
  unitInfo.selectionRoot = selectionRoot
  return unitInfo
}
