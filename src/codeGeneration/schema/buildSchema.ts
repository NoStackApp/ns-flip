'use strict'

import {NsInfo} from '../../constants/types/nsInfo'
import {Configuration, Schema} from '../../constants/types/schema'
import {addUserClass} from './newUserClass'

import {addUnits} from './addUnits'
import {addJoins} from './addJoins'
import {setSelectionRoots} from './setSelectionRoots'
const emptySchema: Schema = {
  userClasses: {},
  sources: {},
  types: {},
  actions: {},
  topSource: '',
}

export const buildSchema = async (nsInfo: NsInfo, config: Configuration) => {
  let schema: Schema = emptySchema

  const {units, userClass, joins} = nsInfo
  schema = addUserClass(schema, userClass)

  schema = addUnits(units, schema, config)
  if (joins) {
    schema = addJoins(joins, schema)
  }

  schema = setSelectionRoots(schema)

  schema.backend = Object.assign({}, nsInfo.backend)
  // console.log(`schema = ${JSON.stringify(schema, null, 2)}`)

  return schema
}
