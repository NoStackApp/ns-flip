import {commentClose, commentOpen, possibleSpace, space} from './regExShared'

const regExFileText = `${commentOpen}${space}ns__file unit:${space}(\\S*),${space}comp:${space}(\\S*)${possibleSpace}${commentClose}`
export const regExFileInfo = new RegExp(regExFileText, 'g')
