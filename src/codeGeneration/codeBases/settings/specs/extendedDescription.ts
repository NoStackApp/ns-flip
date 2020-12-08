import {explanation} from '../../../../shared/constants/chalkColors'

export const extendedDescription = (type: string, description: string|undefined) => {
  if (!description || description.length === 0) return type
  return type + ' ' + explanation(description)
}
