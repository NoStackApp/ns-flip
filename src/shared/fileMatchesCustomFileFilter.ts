import {Configuration} from './constants/types/configuration'

const minimatch = require('minimatch')

export function fileMatchesCustomFileFilter(fileName: string, config: Configuration) {
  const filter = config.format.customFileFilter
  return minimatch(
    fileName, filter, {dot: true, matchBase: true}
  )
}
