export const commentOpen = '(\\/\\/|\\/\\*)'
export const commentClose = '(\\n|\\*\\/)'
export const content = '((.|\n)*?)'

export const space = '[ \\t]+'
export const possibleSpace = '[ \\t]*'

export const opening = commentOpen + possibleSpace
export const closing = possibleSpace + commentClose
export const specString = space + '(\\S*)'

export const openingMarker = (tag: string) => opening + tag + specString + closing
export const closingMarker = (tag: string) => opening + tag + space + '\\2' + closing

// for backward compatibility
export const locationSpec = '(\\S*), comp: (\\S*), loc: (\\S*)'
export const locationRepetition = '\\2, comp: \\3, loc: \\4'

