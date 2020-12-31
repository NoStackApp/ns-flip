import {Configuration} from '../shared/constants/types/configuration'

const globalDefaultOpen = '/*'
const globalDefaultClose = '*/'

export function commentDelimiters(ext: string, config: Configuration) {
  const {format} = config

  let open = format.defaultOpenComment || globalDefaultOpen
  let close = format.defaultCloseComment || globalDefaultClose

  if (format.openComment && format.openComment[ext]) {
    open = format.openComment[ext]
  }
  if (format.closeComment && format.closeComment[ext]) {
    close = format.closeComment[ext]
  }

  return {
    open,
    close,
  }
}
