import {Configuration} from '../../constants/types/configuration'
import {commentDelimiters} from '../../shared/commentDelimiters'
import {magicStrings} from '../../constants'

const path = require('path')

export function replaceCommentDelimiters(pathString: string, config: Configuration, fileText: string) {
  const ext = path.extname(pathString.slice(0, -4))
  const delimiters = commentDelimiters(ext, config)
  const finalFileText = fileText
  .replace(new RegExp(magicStrings.OPEN_COMMENT_PLACEHOLDER, 'g'), delimiters.open)
  .replace(new RegExp(magicStrings.CLOSE_COMMENT_PLACEHOLDER, 'g'), delimiters.close)
  return finalFileText
}
