import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import {Choice} from './settingsTypes'

function getChoicesForSpecChildren(specSubtree: any, subTreePath: string) {
  let specChildrenChoices: Choice[] = []
  if (specSubtree) {
    const types = Object.keys(specSubtree)
    specChildrenChoices = types.map((typeName: string) => {
      const childValue = specSubtree[typeName]
      const typeOfValue = typeof childValue
      console.log(`typeOf ${typeName} is ${typeOfValue}`)

      return {
        name: chalk.blueBright(typeName) + ': ' + specSubtree[typeName].description,
        value: typeName,
        short: typeName,
      }
    })
  }
  return specChildrenChoices
}

export async function updateInstanceSpecs(
  staticType: string,
  instanceName: string,
  config: Configuration,
  nsInfo: NsInfo,
  codeDir: string,
) {

}
