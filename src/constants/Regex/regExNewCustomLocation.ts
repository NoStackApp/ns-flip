import {commentOpen, content, commentClose, possibleSpace} from './regExShared'

const firstLineBody = `${commentOpen} ns__custom_start (\\S*)${possibleSpace}${commentClose}`
const fullRegExBody = `${firstLineBody}${content}${commentOpen} ns__custom_end \\2${possibleSpace}${commentClose}`

export const regExNewCustomLocation = new RegExp(fullRegExBody, 'g')
export const regExForFirstLine = new RegExp(firstLineBody, 'g')
