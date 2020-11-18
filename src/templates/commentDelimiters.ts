import {Configuration} from '../shared/constants/types/configuration'

const globalDefaultOpen = '/*'
const globalDefaultClose = '*/'

export function commentDelimiters(ext: string, config: Configuration) {
  const {format} = config
  const defaultOpen = format.defaultOpenComment || globalDefaultOpen
  const defaultClose = format.defaultCloseComment || globalDefaultClose

  let open = defaultOpen
  let close = defaultClose

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
