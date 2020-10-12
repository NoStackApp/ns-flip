import {NsInfo} from '../../constants/types/nsInfo'
import {Configuration, Schema} from '../../constants/types/schema'
import {generateUnitTypeFiles} from './generateUnitTypeFiles'

export async function generateAppTypeFiles(
  userClass: string,
  appInfo: NsInfo,
  stackInfo: Schema,
  templateDir: string,
  compDir: string,
  config: Configuration,
) {
  const units = stackInfo.sources
  const unitKeys = Object.keys(units)

  let i
  for (i = 0; i < unitKeys.length; i++) {
    const unit = unitKeys[i]

    // eslint-disable-next-line no-await-in-loop
    await generateUnitTypeFiles(
      unit,
      userClass,
      appInfo,
      stackInfo,
      templateDir,
      compDir,
      config,
    )
  }
}
