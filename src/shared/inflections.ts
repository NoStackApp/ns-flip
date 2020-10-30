const pluralize = require('pluralize')
const inflection = require('inflection')

export function allCaps(text: string) {
  if (text) return inflection.underscore(text).toUpperCase()
}

export function singularName(name: string) {
  return inflection.camelize(name)
}

export function pluralName(name: string) {
  return inflection.camelize(pluralize(name))
}

export function pluralLowercaseName(name: string) {
  return pluralize(name)
}

export function relationshipsForSource(source: string) {
  return `${allCaps(source)}_RELATIONSHIPS`
}

export function queryForSource(source: string) {
  return `SOURCE_${allCaps(source)}_QUERY`
}
