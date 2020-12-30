import {regExTemplateAbbreviation} from '../shared/constants/Regex/regExTemplateAbbreviation'
import {placeholders} from '../shared/constants'

export function expandNsAbbreviations(template: string) {
  return template
  .replace(regExTemplateAbbreviation, '{{$1 \'$2\'}}')
  .replace('{{nsFile}}',
    placeholders.OPEN_COMMENT +
    ' ns__file {{fileInfo}} ' +
    placeholders.CLOSE_COMMENT
  )
}
