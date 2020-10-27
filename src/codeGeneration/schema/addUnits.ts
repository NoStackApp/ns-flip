import {Units} from '../../constants/types/nsInfo'
import {Schema} from '../../constants/types/schema'

import {newUnit} from  './newUnit'
import {Configuration} from '../../constants/types/configuration'

export function addUnits(units: Units, schema: Schema, config: Configuration) {
  if (units) {
    Object.keys(units).map(unitString => {
      const unitInfo = units[unitString]
      newUnit(schema, unitString, unitInfo, config)
    })
  }
  return schema
}
