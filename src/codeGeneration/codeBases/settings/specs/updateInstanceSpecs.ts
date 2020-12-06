import {Configuration} from '../../../../shared/constants/types/configuration'
import {NsInfo} from '../../../../shared/constants/types/nsInfo'
import {setNsInfo} from '../../../../shared/nsFiles/setNsInfo'
import {types} from '../types'
import {updateSpecSubtree} from './updateSpecSubtree'

export async function updateInstanceSpecs(
  staticType: string,
  instanceName: string,
  config: Configuration,
  nsInfo: NsInfo,
  codeDir: string,
) {
  const specsForType = {
    type: 'set',
    required: true,
    contents: config.static[staticType].specs,
  }

  if (!nsInfo.static) return
  const specsForInstance = nsInfo.static[staticType][instanceName].specs

  try {
    nsInfo.static[staticType][instanceName].specs =
      await updateSpecSubtree(
        specsForInstance,
        specsForType,
        types.SET,
        instanceName,
        true,
      )
    await setNsInfo(codeDir, nsInfo)
  } catch (error) {
    console.log(error)
    throw new Error(`problem updating specs: ${error}`)
  }
}
