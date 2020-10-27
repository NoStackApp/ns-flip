import {Configuration} from '../constants/types/configuration'

const fs = require('fs-extra')
const yaml = require('js-yaml')

export async function getConfiguration(templateDir: string) {
  let config: Configuration
  const configFile = `${templateDir}/config.yml`
  try {
    const appYaml = fs.readFileSync(configFile, 'utf8')
    config = await yaml.safeLoad(appYaml)
  } catch (error) {
    throw new Error(`error finding the config file ${configFile}.
It may be that the template location is faulty, or that the file does not exist
or is not properly set up:
${error}`)
  }
  return config
}
