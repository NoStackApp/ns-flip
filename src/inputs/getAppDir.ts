import {appNameFromPath} from './appNameFromPath'

import {promptTypes, promptUser} from './promptUser'

const fs = require('fs-extra')

const testAppDir = async (appDir: string) => {
  const appName = appNameFromPath(appDir)
  if (!appDir || appName.length === 0)
    return 'Your directory is missing for your app.  Please enter a path and a final directory name (all numbers and lowercase letters, no spaces).'

  const upperCaseCheck = /(.*[A-Z].*)/
  if (upperCaseCheck.test(appDir))
    return `The appName '${appName}' contains at least one capital, which create-react-app does not permit.  Please enter a new path...`

  if (await fs.pathExists(appDir))
    return `There already exists a directory ${appDir}.  Either delete the directory and try again or give a new name.  Please enter a path again...`

  return ''
}

export async function getAppDir(appDir: string | undefined) {
  let prompt = 'Please enter a path for your app.  The actual directory of the app must be all numbers and lowercase letters, with no spaces.'
  if (appDir) {
    prompt = await testAppDir(appDir)
  }
  if (prompt.length === 0) return appDir

  return promptUser(
    'appDir',
    promptTypes.TEXT,
    prompt,
    testAppDir,
  )
}
