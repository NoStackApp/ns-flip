// just for backward compatibility
import {
  content,
  locationRepetition,
  locationSpec,
  space,
  opening,
  closing,
} from './regExShared'

const firstLineBody = `${opening}ns__custom_start${space}unit:${space}${locationSpec}${closing}`
export const customLocationRegExString = `${firstLineBody}${content}${opening}ns__custom_end${space}unit:${space}${locationRepetition}${closing}`
