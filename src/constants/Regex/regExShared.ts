import {Delimiters} from '..'

export const commentOpen = '(\\/\\/|\\/\\*)'
export const commentClose = '(\\n|\\*\\/)'
export const content = '((.|\n)*?)'

export const space = '[ \\t]+'
export const possibleSpace = '[ \\t]*'

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string: string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function convertDelimitersForRegEx(commentDelimiter: string) {
  if (commentDelimiter === '\\n[//]: # (')
    console.log(`commentDelimiter=${commentDelimiter}. escapeRegExp(commentDelimiter)=${escapeRegExp(commentDelimiter)}. Fixed=${escapeRegExp(commentDelimiter).replace('\\\\n', '\\n')}`)
  return escapeRegExp(commentDelimiter).replace('\\\\n', '\\n')
  // return commentDelimiter
}

export const openingForDelimiters = (delimiters: Delimiters) =>
  `${convertDelimitersForRegEx(delimiters.open)}${possibleSpace}`
export const closingForDelimiters = (delimiters: Delimiters) =>
  `${possibleSpace}${convertDelimitersForRegEx(delimiters.close)}`

export const specString = space + '(\\S*)'

// export const openingMarker = (tag: string) => opening + tag + specString + closing
// export const closingMarker = (tag: string) => opening + tag + space + '\\2' + closing
export const openingMarkerForDelimiters = (tag: string, delimiters: Delimiters) =>
  openingForDelimiters(delimiters) + tag + specString + closingForDelimiters(delimiters)
export const closingMarkerForDelimiters = (tag: string, delimiters: Delimiters) =>
  openingForDelimiters(delimiters) + tag + space + '\\1' + closingForDelimiters(delimiters)

// for backward compatibility
export const locationSpec = '(\\S*), comp: (\\S*), loc: (\\S*)'
export const locationRepetition = '\\2, comp: \\3, loc: \\4'

