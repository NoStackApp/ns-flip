import {Configuration} from '../constants/types/configuration'
import {magicStrings} from '../constants'

const fs = require('fs-extra')
const yaml = require('js-yaml')

export async function setConfig(templateDir: string, config: Configuration) {
  const configFile = templateDir + '/' + magicStrings.CONFIG_FILE
  try {
    if (config) await fs.outputFile(configFile, yaml.safeDump(config))
  } catch (error) {
    throw new Error(`error finding the config file ${configFile}.
It may be that the template location is faulty, or that the file does not exist
or is not properly set up:
${error}`)
  }
}
