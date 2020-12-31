import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import {updateStaticTypeInstances} from './instances/updateStaticTypeInstances'
import {menuChoices} from '../../../shared/constants'
import {chooseStaticType} from './chooseStaticType'

export async function staticSettings(
  config: Configuration, nsInfo: NsInfo, codeDir: string
) {
  let staticType = await chooseStaticType(config)

  while (staticType) {
    if (staticType === menuChoices.QUIT) {
      return nsInfo.static
    }

    await updateStaticTypeInstances(
      staticType, config, nsInfo, codeDir
    )
    staticType = await chooseStaticType(config)
  }
}
