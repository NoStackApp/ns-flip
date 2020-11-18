
import {
  content,
  openingMarkerForDelimiters,
  closingMarkerForDelimiters,
} from './regExShared'
import {Delimiters, markupTags} from '..'

// for saving replaced code
// const openReplacement = openingMarker(markupTags.REPLACEMENT_START) // `${opening}${markupTags.REPLACEMENT_START}${specString}${closing}`
// const closeReplacement = closingMarker(markupTags.REPLACEMENT_END)

const openReplacementForDelimiters = (delimiters: Delimiters) =>
  openingMarkerForDelimiters(markupTags.REPLACEMENT_START, delimiters)
const closeReplacementForDelimiters = (delimiters: Delimiters) =>
  closingMarkerForDelimiters(markupTags.REPLACEMENT_END, delimiters)

export const replacedRexExText = (delimiters: Delimiters) =>
  openReplacementForDelimiters(delimiters) + content + closeReplacementForDelimiters(delimiters)

// export const replacedRexExText = `${firstLineBody}${content}${opening}${markupTags.REPLACEMENT_END}${space}\\2${closing}`
export const regExReplacedCodeSection = (delimiters: Delimiters) =>
  new RegExp(replacedRexExText(delimiters), 'g')

// for inserting replaced code.  It's a two-step process.
// See a note of explanation at the point of usage.
const replacedGeneratedRegExText = (delimiters: Delimiters) =>
  openingMarkerForDelimiters(markupTags.SECTION_START, delimiters)// `${opening}ns__start_section${specString}${closing}`
export const regExReplacedCodeSectionGenerated = (delimiters: Delimiters) =>
  new RegExp(replacedGeneratedRegExText(delimiters), 'g')

const taggedOpen = (delimiters: Delimiters) =>
  openingMarkerForDelimiters(markupTags.REPLACEMENT_START, delimiters) // `${opening}//ns__start_replacement${specString}${closing}`
const taggedClose  = (delimiters: Delimiters) =>
  closingMarkerForDelimiters(markupTags.SECTION_END, delimiters)
const replacedTaggedRegExText = (delimiters: Delimiters) =>
  taggedOpen(delimiters) + content + taggedClose(delimiters)
// const replacedTaggedRegExText = `${taggedOpen}${content}${opening}ns__end_section${space}\\2${closing}`
export const regExReplacedCodeSectionTagged = (delimiters: Delimiters) =>
  new RegExp(replacedTaggedRegExText(delimiters), 'g')
