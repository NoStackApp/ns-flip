import {singularName} from '../../shared/inflections'
import {parseSpecName} from '../../shared/constants/parseSpecName'

export const unitNameFromSpec = (text: string) => {
  return singularName(parseSpecName(text).name)
}
