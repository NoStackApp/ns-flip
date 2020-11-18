import {associationTypes, typePrefixes} from '../../shared/constants'

export const assnTypesForPrefix = {
  [typePrefixes.CREATE]: associationTypes.MULTIPLE,
  [typePrefixes.SELECT]: associationTypes.SELECTABLE,
  [typePrefixes.USE]: associationTypes.VIEWABLE,
  [typePrefixes.CONSTRAIN]: associationTypes.VIEWABLE,
}
