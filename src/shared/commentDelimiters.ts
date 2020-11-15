import {Configuration} from '../constants/types/configuration'

const globalDefaultOpen = '/*'
const globalDefaultClose = '*/'

export function commentDelimiters(ext: string, config: Configuration) {
  const {format} = config
  const defaultOpen = format.defaultOpenComment || globalDefaultOpen
  const defaultClose = format.defaultCloseComment || globalDefaultClose

  const open = format.openComment[ext] || defaultOpen
  const close = format.closeComment[ext] || defaultClose

  return {
    open,
    close,
  }
}
