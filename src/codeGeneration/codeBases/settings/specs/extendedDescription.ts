import {explanation} from '../../../../shared/constants/chalkColors'

export const extendedDescription = (type: string, description: string) => {
  if (!description || description.length === 0) return type
  return type + ' ' + explanation(description)
}
