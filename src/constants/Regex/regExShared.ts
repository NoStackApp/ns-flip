export const commentOpen = '(\\/\\/|{\\/\\*)'
export const endOfLine = '( \\*\\/\\}\\n|\\n)'
export const content = '((.|\n)*?)'

export const locationSpec = '(\\S*), comp: (\\S*), loc: (\\S*)'
export const locationRepetition = '\\2, comp: \\3, loc: \\4'
