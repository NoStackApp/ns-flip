import {NsInfo} from '../constants/types/nsInfo'

const fs = require('fs-extra')
const yaml = require('js-yaml')

export async function getNsInfo(codeFile: string) {
  let nsInfo: NsInfo
  try {
    const nsYml = fs.readFileSync(codeFile, 'utf8')
    nsInfo = await yaml.safeLoad(nsYml)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error opening app.yml')
    throw error
  }
  return nsInfo
}
