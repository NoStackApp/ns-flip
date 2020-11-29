import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'

function configSpecsSetValues(currentSpecsConfig: any, currentInstanceSpecs: any, path: string) {
  const highestLevelConfigTypes = Object.keys(currentSpecsConfig)
}

export function staticInstanceSpecs(
  staticType: string,
  instanceName: string,
  config: Configuration,
  nsInfo: NsInfo,
  codeDir: string,
) {
  if (!nsInfo.static ||
    !nsInfo.static[staticType] ||
    !nsInfo.static[staticType][instanceName]
  ) throw new Error(`attempt to edit nonexistent static instance ${instanceName}.`)

  const instanceInfo = nsInfo.static[staticType][instanceName]
  const instanceSpecs = instanceInfo.specs

  const specsConfig = config.static[staticType].specs
}
