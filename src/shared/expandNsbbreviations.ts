import {regExTemplateAbbreviation} from '../constants/Regex/regExTemplateAbbreviation'

export function expandNsAbbreviations(template: string) {
  return template
  .replace(regExTemplateAbbreviation, '{{$1 \'$2\'}}')
  .replace('{{nsFile}}', '/* ns__file {{fileInfo}} */')
}
