import {Units} from '../../shared/constants/types/nsInfo'
import {Schema} from '../../shared/constants/types/schema'

import {newUnit} from  './newUnit'
import {Configuration} from '../../shared/constants/types/configuration'

export function addUnits(
  units: Units, schema: Schema, config: Configuration
) {
  if (units) {
    Object.keys(units).map(unitString => {
      const unitInfo = units[unitString]
      newUnit(
        schema, unitString, unitInfo, config
      )
    })
  }
  return schema
}
