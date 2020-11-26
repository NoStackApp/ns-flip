import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import {Choice} from './settingsTypes'
import * as chalk from 'chalk'

function getChoicesForSpecChildren(specSubtree: any, subTreePath: string) {
  let specChildrenChoices: Choice[] = []
  if (specSubtree) {
    const types = Object.keys(specSubtree)
    specChildrenChoices = types.map((specName: string) => {
      const childValue = specSubtree[specName]
      const typeOfValue = typeof childValue
      console.log(`typeOf ${specName} is ${typeOfValue}`)

      return {
        name: `${chalk.blueBright(specName)} ${typeOfValue}`,
        value: specName,
        short: specName,
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
  const specsForType = config.static[staticType].specs
  const specChoices = getChoicesForSpecChildren(specsForType, '')

  console.log(`specChoices = ${JSON.stringify(specChoices, null, 1)}`)
}
