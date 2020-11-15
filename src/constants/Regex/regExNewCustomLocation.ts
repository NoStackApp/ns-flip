import {
  content,
  openingMarkerForDelimiters,
  closingMarkerForDelimiters,
} from './regExShared'
import {Delimiters, markupTags} from '..'

// const openCustom = openingMarker(markupTags.CUSTOM_START)
// const closeCustom = closingMarker(markupTags.CUSTOM_END)
const openCustomForDelimiters = (delimiters: Delimiters) =>
  openingMarkerForDelimiters(markupTags.CUSTOM_START, delimiters)
const closeCustomForDelimiters =  (delimiters: Delimiters) =>
  closingMarkerForDelimiters(markupTags.CUSTOM_END, delimiters)

export const customLocationNewRegExString = (delimiters: Delimiters) =>
  openCustomForDelimiters(delimiters) + content + closeCustomForDelimiters(delimiters)
