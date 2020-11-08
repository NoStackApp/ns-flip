
import {commentOpen, content, commentClose, locationRepetition, locationSpec} from './regExShared'

// for saving replaced code
const firstLineBody = `${commentOpen} ns__start_replacement (\\S*)${commentClose}`
const fullRegExBody = `${firstLineBody}${content}${commentOpen} ns__end_replacement \\2${commentClose}`
export const regExReplacedCodeSection = new RegExp(fullRegExBody, 'g')

// for inserting replaced code.  It's a two-step process.
// See a note of explanation at the point of usage.
const firstLineBodyGenerated = `${commentOpen} ns__start_section unit: ${locationSpec}${commentClose}`
export const regExReplacedCodeSectionGenerated = new RegExp(firstLineBodyGenerated, 'g')

const firstLineBodyTagged = `${commentOpen} ns__start_replacement unit: ${locationSpec}${commentClose}`
const fullRegExBodyTagged = `${firstLineBodyTagged}${content}${commentOpen} ns__end_section unit: ${locationRepetition}${commentClose}`
export const regExReplacedCodeSectionTagged = new RegExp(fullRegExBodyTagged, 'g')
