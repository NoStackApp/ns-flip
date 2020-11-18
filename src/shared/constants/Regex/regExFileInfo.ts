import {closingForDelimiters, openingForDelimiters, space, specString} from './regExShared'
import {Delimiters, markupTags} from '../index'

export const regExFileText = (delimiters: Delimiters) =>
  openingForDelimiters(delimiters) + markupTags.FILE_INFO +
  space + 'unit:' + specString + ',' +
  space + 'comp:' + specString +
  closingForDelimiters(delimiters)
