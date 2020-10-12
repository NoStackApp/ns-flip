import {promptTypes, promptUser} from './promptUser'

const fs = require('fs-extra')

const testBaseApp = async (baseApp: string) => {
  if (baseApp.length > 0 && !await fs.pathExists(baseApp))
    return `The baseApp directory that you provided, '${baseApp}', does not exist.
    Please enter a new name or add the directory '${baseApp}' now.`

  return ''
}

export async function getBaseApp(baseApp: string | undefined) {
  let prompt = 'Please enter your baseApp now'
  if (baseApp) {
    prompt = await testBaseApp(baseApp)
  }
  if (prompt.length === 0) return baseApp

  return promptUser(
    'baseApp',
    promptTypes.TEXT,
    prompt,
    testBaseApp,
  )
}
