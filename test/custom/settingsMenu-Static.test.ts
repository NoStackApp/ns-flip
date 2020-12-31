import {settingsMenu} from '../../src/codeGeneration/codeBases/settings/settingsMenu'
import {answerValues, questionNames} from '../../src/shared/constants'
import {DONE} from '../../src/codeGeneration/codeBases/settings/types'
import {Configuration} from '../../src/shared/constants/types/configuration'
import {getConfig} from '../../src/shared/configs/getConfig'
import {NsInfo} from '../../src/shared/constants/types/nsInfo'
import {getNsInfo} from '../../src/shared/nsFiles/getNsInfo'
import {expect} from '@oclif/test'
import {afterEach, beforeEach} from 'mocha'
import * as staticSettingsModule from '../../src/codeGeneration/codeBases/settings/staticSettings'

const inquirer = require('inquirer')
const sinon = require('sinon')

const staticSettingsMock = async (config: Configuration, nsInfo: NsInfo) => {
  const sampleString =
    Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 10)
  if (nsInfo.static)
    nsInfo.static.command[sampleString] = {
      slug: sampleString,
      specs: {},
    }
  return nsInfo.static
}

let currentStep: number
const inquirerPromptMock = async () => {
  if (currentStep === 1) {
    currentStep = 2
    return Promise.resolve({[questionNames.SETTINGS_TYPE]: answerValues.settingsTypes.STATIC})
  }
  return Promise.resolve({[questionNames.SETTINGS_TYPE]: DONE})
}

describe('static settings update', async () => {
  let staticSettingsStub: any
  let inquirerPromptStub: any
  beforeEach(() => {
    staticSettingsStub = sinon.stub(staticSettingsModule, 'staticSettings').callsFake(staticSettingsMock)
    inquirerPromptStub = sinon.stub(inquirer, 'prompt').callsFake(inquirerPromptMock)
  })

  afterEach(() => {
    staticSettingsStub.restore()
    inquirerPromptStub.restore()
  })

  it('should set static', async () => {
    const mockTemplateDir = `${__dirname}/data`
    const config: Configuration = await getConfig(mockTemplateDir)
    const nsInfo: NsInfo = await getNsInfo(mockTemplateDir)
    const originalSettings = JSON.parse(JSON.stringify(nsInfo))

    currentStep = 1
    const output = await settingsMenu(
      config, nsInfo, ''
    )
    expect(output.general).to.deep.equal(originalSettings.general)
    expect(output.units).to.deep.equal(originalSettings.units)
    expect(output.static).to.not.equal(originalSettings.static)
  })
})
