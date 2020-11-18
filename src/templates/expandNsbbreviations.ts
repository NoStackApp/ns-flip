import {regExTemplateAbbreviation} from '../shared/constants/Regex/regExTemplateAbbreviation'
import {magicStrings} from '../shared/constants'

export function expandNsAbbreviations(template: string) {
  return template
  .replace(regExTemplateAbbreviation, '{{$1 \'$2\'}}')
  .replace('{{nsFile}}',
    magicStrings.OPEN_COMMENT_PLACEHOLDER +
    ' ns__file {{fileInfo}} ' +
    magicStrings.CLOSE_COMMENT_PLACEHOLDER
  )
}
