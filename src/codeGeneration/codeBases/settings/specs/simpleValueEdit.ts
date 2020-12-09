function convertBoolean(value: any) {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }

  if (value !== true && value !== false) {
    throw new Error(`non boolean value returned for boolean: ${JSON.stringify(value)}`)
  }

  return value
}

export function simpleValueEdit(type: string, value: any) {
  // a simple value was provided.  Clearly not a list or set.
  const typeOfValue = typeof value

  if (type === 'boolean' ||
    (type === 'any' && typeOfValue === 'boolean')) {
    return convertBoolean(value)
  }

  if (type === 'string[]') {
    return JSON.parse(value.replace(/'/g, '"'))
  }

  if (value === '') return null

  return value
}
