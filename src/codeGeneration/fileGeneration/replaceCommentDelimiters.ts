import {Configuration} from '../../shared/constants/types/configuration'
import {commentDelimiters} from '../../templates/commentDelimiters'
import {placeholders} from '../../shared/constants'

const path = require('path')

export function replaceCommentDelimiters(pathString: string, config: Configuration, fileText: string) {
  const ext = path.extname(pathString.slice(0, -4))
  const delimiters = commentDelimiters(ext, config)
  const finalFileText = fileText
  .replace(new RegExp(placeholders.OPEN_COMMENT, 'g'), delimiters.open)
  .replace(new RegExp(placeholders.CLOSE_COMMENT, 'g'), delimiters.close)
  return finalFileText
}
