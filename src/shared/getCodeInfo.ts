import {NsInfo} from '../constants/types/nsInfo'

const fs = require('fs-extra')
const yaml = require('js-yaml')

export async function getCodeInfo(codeFile: string) {
  let appInfo: NsInfo
  try {
    const nsYml = fs.readFileSync(codeFile, 'utf8')
    appInfo = await yaml.safeLoad(nsYml)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error opening app.yml')
    throw error
  }
  return appInfo
}
