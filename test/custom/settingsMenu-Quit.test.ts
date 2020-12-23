import {settingsMenu} from '../../src/codeGeneration/codeBases/settings/settingsMenu'
import {questionNames} from '../../src/shared/constants'
import {DONE} from '../../src/codeGeneration/codeBases/settings/types'
import {Configuration} from '../../src/shared/constants/types/configuration'
import {getConfig} from '../../src/shared/configs/getConfig'
import {NsInfo} from '../../src/shared/constants/types/nsInfo'
import {getNsInfo} from '../../src/shared/nsFiles/getNsInfo'
import {expect} from '@oclif/test'
import {afterEach, beforeEach} from 'mocha'

const inquirer = require('inquirer')

describe('settings exits properly', async () => {
  let backup: any

  beforeEach(() => {
    backup = inquirer.prompt
  })
  afterEach(() => {
    inquirer.prompt = backup
  })

  it('should quit', async () => {
    const mockTemplateDir = `${__dirname}/data`
    const config: Configuration = await getConfig(mockTemplateDir)
    const nsInfo: NsInfo = await getNsInfo(mockTemplateDir)
    inquirer.prompt = async () => Promise.resolve({[questionNames.SETTINGS_TYPE]: DONE})
    const output = await settingsMenu(config, nsInfo, '')
    expect(output).to.deep.equal(nsInfo)
  })
})
