import {Delimiters} from '..'

export const commentOpen = '(\\/\\/|\\/\\*)'
export const commentClose = '(\\n|\\*\\/)'
export const content = '((.|\n)*?)'

export const space = '[ \\t]+'
export const possibleSpace = '[ \\t]*'

// export const opening = commentOpen + possibleSpace
// export const closing = possibleSpace + commentClose

function escapeRegExp(string: string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export const openingForDelimiters = (delimiters: Delimiters) =>
  `${escapeRegExp(delimiters.open)}${possibleSpace}`
export const closingForDelimiters = (delimiters: Delimiters) =>
  `${possibleSpace}${escapeRegExp(delimiters.close)}`

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

