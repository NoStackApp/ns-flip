import {commentOpen, content, commentClose, locationRepetition, locationSpec} from './regExShared'

const firstLineBody = `${commentOpen}[ \\t]*ns__custom_start[ \\t]+unit: ${locationSpec}${commentClose}`
const fullRegExBody = `${firstLineBody}${content}${commentOpen}[ \\t]*ns__custom_end[ \\t]+unit: ${locationRepetition}${commentClose}`

export const regExCustomLocation = new RegExp(fullRegExBody, 'g')
export const regExForFirstLine = new RegExp(firstLineBody, 'g')
