import {regExObjectValueString} from '../../../../shared/constants/Regex/regExObjectValueString'

const regExObjectValue = new RegExp(regExObjectValueString, 'g')
const globalObjects = {
  SETTINGS: 'nsInfo',
  ANSWERS: 'answers',
  SESSION: 'session',
  CONFIG: 'config',
}

function fixBooleans(str: string) {
  // assumes that a 'true' or 'false' is meant to be a boolean.
  if (str === 'true') return true
  if (str === 'false') return false
  return str
}

function replaceGlobalObjectValues(value: any, session: any, answers: any) {
  const newValue = value.replace(regExObjectValue, function (
    match: string,
    objectName: string,
    key: string,
  ) {
    if (objectName === globalObjects.ANSWERS) return answers[key]
    if (objectName === globalObjects.SESSION) return session[key]
    // if (objectName === globalObjects.SETTINGS) return nsInfo[key]
  })

  return newValue
}

export function replaceGlobalValuesInObject(rawObject: any, session: any, answers: any = {}) {
  const keys = Object.keys(rawObject)
  const newObject = {...rawObject}

  keys.map((key: string) => {
    const value = rawObject[key]
    if ((typeof value) !== 'string') return

    newObject[key] = replaceGlobalObjectValues(value, session, answers)
    if (value !== newObject[key]) newObject[key] = fixBooleans(newObject[key])
  })

  return newObject
}
