// for backward compatibility
import {closingForDelimiters, locationSpec, openingForDelimiters} from './regExShared'
import {Delimiters} from '..'

export const regExCleanupText = (delimiters: Delimiters) =>
  `${openingForDelimiters(delimiters)}ns__(start|end)_(section|replacement) unit: ${locationSpec}${closingForDelimiters(delimiters)}`
