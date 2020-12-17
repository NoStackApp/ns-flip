import {META_DELIMITER} from '..'

const objectName = '[a-zA-Z]+'
const key = '(.|\\.)*'
export const regExObjectValueString = META_DELIMITER + `(${objectName})\\.(${key})` + META_DELIMITER
