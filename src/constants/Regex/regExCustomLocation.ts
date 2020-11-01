import {commentOpen, content, endOfLine, locationRepetition, locationSpec} from './regExShared'

const firstLineBody = `${commentOpen} ns__custom_start unit: ${locationSpec}${endOfLine}`
const fullRegExBody = `${firstLineBody}${content}${commentOpen} ns__custom_end unit: ${locationRepetition}`

export const regExCustomLocation = new RegExp(fullRegExBody, 'g')
export const regExForFirstLine = new RegExp(firstLineBody, 'g')
