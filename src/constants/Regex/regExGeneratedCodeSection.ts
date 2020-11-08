import {commentOpen, content, commentClose, locationSpec, locationRepetition} from './regExShared'

const firstLineBody = `${commentOpen} ns__start_section unit: ${locationSpec}${commentClose}`
const fullRegExBody = `${firstLineBody}${content}${commentOpen} ns__end_section unit: ${locationRepetition}`

export const regExGeneratedCodeSection = new RegExp(fullRegExBody, 'g')
