import {regExFileInfo} from '../../constants/Regex/regExFileInfo'

export function getFileInfo(fileText: string) {
  let unit = ''
  let component = ''

  const fileInfoMatch = regExFileInfo.exec(fileText)

  if (fileInfoMatch) {
    unit = fileInfoMatch[1]
    component = fileInfoMatch[2]
  }

  return {
    unit,
    component,
  }
}
