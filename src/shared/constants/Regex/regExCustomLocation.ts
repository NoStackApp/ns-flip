// just for backward compatibility
import {
  content,
  locationRepetition,
  locationSpec,
  space,
  openingForDelimiters,
  closingForDelimiters,
} from './regExShared'
import {Delimiters} from '../index'

const firstLineBody = (delimiters: Delimiters) =>
  `${openingForDelimiters(delimiters)}ns__custom_start${space}unit:${space}${locationSpec}${closingForDelimiters(delimiters)}`
export const customLocationRegExString = (delimiters: Delimiters) =>
  `${firstLineBody(delimiters)}${content}${openingForDelimiters(delimiters)}ns__custom_end${space}unit:${space}${locationRepetition}${closingForDelimiters(delimiters)}`
