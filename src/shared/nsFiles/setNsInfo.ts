import {dirNames, fileNames} from '../constants'
import {NsInfo} from '../constants/types/nsInfo'

const fs = require('fs-extra')
const yaml = require('js-yaml')

export async function setNsInfo(codeDir: string, nsInfo: NsInfo) {
  const nsFile = codeDir + `/${dirNames.META_DIR}/` + fileNames.NS_FILE
  let outputContents
  try {
    if (nsInfo) {
      outputContents = yaml.safeDump(nsInfo)
      await fs.outputFile(nsFile, outputContents)
    }
  } catch (error) {
    throw new Error(`error updating the nsFile ${nsFile}.
      Info = ${JSON.stringify(nsInfo, null, 2)}.
      Output contents = ${outputContents}: ${error}`)
  }
}
