
import {content, openingMarker, closingMarker} from './regExShared'
import {markupTags} from '..'

// for saving replaced code
const openReplacement = openingMarker(markupTags.REPLACEMENT_START) // `${opening}${markupTags.REPLACEMENT_START}${specString}${closing}`
const closeReplacement = closingMarker(markupTags.REPLACEMENT_END)
export const replacedRexExText = openReplacement + content + closeReplacement

// export const replacedRexExText = `${firstLineBody}${content}${opening}${markupTags.REPLACEMENT_END}${space}\\2${closing}`
export const regExReplacedCodeSection = new RegExp(replacedRexExText, 'g')

// for inserting replaced code.  It's a two-step process.
// See a note of explanation at the point of usage.
const replacedGeneratedRegExText =  openingMarker(markupTags.SECTION_START)// `${opening}ns__start_section${specString}${closing}`
export const regExReplacedCodeSectionGenerated = new RegExp(replacedGeneratedRegExText, 'g')

const taggedOpen =  openingMarker(markupTags.REPLACEMENT_START) // `${opening}//ns__start_replacement${specString}${closing}`
const taggedClose = closingMarker(markupTags.SECTION_END)
const replacedTaggedRegExText = taggedOpen + content + taggedClose
// const replacedTaggedRegExText = `${taggedOpen}${content}${opening}ns__end_section${space}\\2${closing}`
export const regExReplacedCodeSectionTagged = new RegExp(replacedTaggedRegExText, 'g')
