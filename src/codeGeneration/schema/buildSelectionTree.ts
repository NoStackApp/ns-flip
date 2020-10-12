import {SourceInfo} from '../../constants/types/schema'

export const buildSelectionTree = (
  node: string,
  selectedParent: string,
  sourceInfo: SourceInfo,
) => {
  // const sourceInfo = stack.sources[source];
  const tree = sourceInfo.tree
  // console.log(`in buildSelectionTree for ${sourceInfo.name} for node ${node}. tree=${JSON.stringify(tree)}`)
  const selectedTree = sourceInfo.selectedTree
  const children = Object.keys(tree[node])
  // console.log(`in buildSelectionTree for ${sourceInfo.name} for node ${node}. children=${JSON.stringify(children)}`)
  // console.log(`in buildSelectionTree for ${sourceInfo.name} for node ${node}. selectedTree=${JSON.stringify(selectedTree)}`)
  // console.log(`in buildSelectionTree for ${sourceInfo.name} for node ${node}. selectedTree[node]=${selectedTree[node]}`)
  let selectedParentForDescendents = selectedParent
  if (selectedTree[node]) {
    selectedTree[selectedParent].push(node)
    selectedParentForDescendents = node
  }

  let i
  for (i = 0; i < children.length; i++) {
    const child = children[i]
    sourceInfo = buildSelectionTree(
      child,
      selectedParentForDescendents,
      sourceInfo
    )
  }

  return sourceInfo
}
