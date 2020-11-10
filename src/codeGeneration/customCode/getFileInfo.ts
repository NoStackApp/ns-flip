import {regExFileText} from '../../constants/Regex/regExFileInfo'
export function getFileInfo(fileText: string) {
  let unit = ''
  let component = ''
  const regExFileInfo = new RegExp(regExFileText, 'g')

  const fileInfoMatch = regExFileInfo.exec(fileText)
  // console.log(`in getFileInfo, fileInfoMatch = ${JSON.stringify(fileInfoMatch)}`)

  if (fileInfoMatch) {
    unit = fileInfoMatch[2]
    component = fileInfoMatch[3]
  }

  return {
    unit,
    component,
  }
}
