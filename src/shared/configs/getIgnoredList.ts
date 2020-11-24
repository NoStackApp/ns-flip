import {Configuration} from '../constants/types/configuration'
import {standardIgnored} from '../constants'

export function getIgnoredList(config: Configuration) {
  let allIgnored = [...standardIgnored]
  if (config.ignore)
    allIgnored = [...allIgnored, ...config.ignore]
  allIgnored.push(config.dirs.custom)
  return allIgnored
}
