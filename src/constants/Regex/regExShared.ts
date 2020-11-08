export const commentOpen = '(\\/\\/|\\/\\*)'
// export const commentOpen = '(\\/\\/|{\\/\\*|\\/\\*)'
export const commentClose = '(\\n|\\*\\/)'
// export const commentClose = '(\\*\\/\\}\\n|\\n|\\*\\/)'
export const content = '((.|\n)*?)'

export const space = '[ \\t]+'
export const possibleSpace = '[ \\t]*'

export const locationSpec = '(\\S*), comp: (\\S*), loc: (\\S*)'
export const locationRepetition = '\\2, comp: \\3, loc: \\4'
