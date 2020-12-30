import {NsInfo} from '../constants/types/nsInfo'
import {dirNames, fileNames} from '../constants'

const fs = require('fs-extra')
const yaml = require('js-yaml')

export async function getNsInfo(codeDir: string) {
  let nsInfo: NsInfo
  const nsFile = codeDir + `/${dirNames.META_DIR}/` + fileNames.NS_FILE
  try {
    const nsYml = fs.readFileSync(nsFile, 'utf8')
    nsInfo = await yaml.safeLoad(nsYml)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error opening ns.yml')
    throw error
  }
  return nsInfo
}
