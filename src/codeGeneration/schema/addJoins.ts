import {JoinsData} from '../../shared/constants/types/nsInfo'
import {Schema} from '../../shared/constants/types/schema'

import {newJoin} from './newJoin'

export function addJoins(joins: JoinsData, schema: Schema) {
  if (joins) {
    Object.keys(joins).map(joinName => {
      const joinInfo = joins[joinName]
      // console.log(`in object joins... joinInfo=${joinInfo}`);

      schema = newJoin(schema, joinName, joinInfo)
    })
  }
  return schema
}
