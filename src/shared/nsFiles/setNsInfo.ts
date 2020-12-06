import {magicStrings} from '../constants'
import {NsInfo} from '../constants/types/nsInfo'

const fs = require('fs-extra')
const yaml = require('js-yaml')

export async function setNsInfo(codeDir: string, nsInfo: NsInfo) {
  const nsFile = codeDir + `/${magicStrings.META_DIR}/` + magicStrings.NS_FILE
  try {
    if (nsInfo) await fs.outputFile(nsFile, yaml.safeDump(nsInfo))
  } catch (error) {
    throw new Error(`error updating the nsFile ${nsFile}.  Info = ${JSON.stringify(nsInfo, null, 2)}: ${error}`)
  }
}
