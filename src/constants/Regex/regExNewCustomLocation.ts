import {commentOpen, content, endOfLine} from './regExShared'

const firstLineBody = `${commentOpen} ns__custom_start (\\S*)${endOfLine}`
const fullRegExBody = `${firstLineBody}${content}${commentOpen} ns__custom_end \\2${endOfLine}`

export const regExNewCustomLocation = new RegExp(fullRegExBody, 'g')
export const regExForFirstLine = new RegExp(firstLineBody, 'g')
