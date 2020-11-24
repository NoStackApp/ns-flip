import {docPages, magicStrings} from '../../shared/constants'

import {regenerateCode} from '../regenerateCode'
import {copyTemplateToMeta} from './copyTemplateToMeta'
import {createStarter} from './createStarter'

const fs = require('fs-extra')

export async function createCodeBase(
  // starterDir: string,
  templateDir: string | undefined,
  codeDir: string,
  noSetup: boolean
) {
  const codeMetaDir = `${codeDir}/${magicStrings.META_DIR}`
  const codeTemplateDir = `${codeMetaDir}/${magicStrings.TEMPLATE}`
  const existsCodeTemplateDir = await fs.pathExists(codeTemplateDir)

  if (!templateDir && noSetup) {
    throw new Error('the noSetup flag cannot be used unless a template is specified.')
  }

  if (!templateDir && !existsCodeTemplateDir) {
    if (!await fs.pathExists(codeDir)) {
      throw new Error('you called \'generate\' without specifying a template' +
        ` for a code base that does not yet exist (${codeDir}).  Please provide a template` +
        'with the \'-t\' flag to create the code base. ' +
        `See ${magicStrings.DOCUMENTATION}/${docPages.BUILDING_CODE_BASE}.`)
    }
    throw new Error('you called \'generate\' without specifying a template' +
      ' for a code base that does not have proper prior template info.  ' +
      'Please provide a template with the \'-t\' flag. ' +
      `See ${magicStrings.DOCUMENTATION}/${docPages.BUILDING_CODE_BASE}.`)
  }

  if (!templateDir && noSetup) {
    throw new Error('you called \'generate\' with the \'--noSetup\' flag without specifying ' +
      'a template.  Please either remove the \'--noSetup\' or provide a template ' +
      'with the \'-t\' flag. ' +
      `See ${magicStrings.DOCUMENTATION}/${docPages.BUILDING_CODE_BASE}.`)
  }

  if (templateDir && (!existsCodeTemplateDir || !noSetup)) {
    await createStarter(templateDir, codeDir)
  }

  if (templateDir) {
    await copyTemplateToMeta(codeTemplateDir, templateDir)
  }

  await regenerateCode(codeDir)
}
