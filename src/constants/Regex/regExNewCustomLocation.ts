import {content, openingMarker, closingMarker} from './regExShared'
import {markupTags} from '..'

const openCustom = openingMarker(markupTags.CUSTOM_START)
const closeCustom = closingMarker(markupTags.CUSTOM_END)

export const customLocationNewRegExString = openCustom + content + closeCustom
