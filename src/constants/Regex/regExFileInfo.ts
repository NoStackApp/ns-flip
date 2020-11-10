import {closing, opening, space, specString} from './regExShared'
import {markupTags} from '..'

export const regExFileText = opening + markupTags.FILE_INFO +
  space + 'unit:' + specString + ',' +
  space + 'comp:' + specString +
  closing
