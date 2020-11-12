import {codeNameFromPath} from './codeNameFromPath'

import {promptTypes, promptUser} from './promptUser'

const fs = require('fs-extra')

const testCodeDir = async (codeDir: string) => {
  const appName = codeNameFromPath(codeDir)
  if (!codeDir || appName.length === 0)
    return 'Your directory is missing for your app.  Please enter a path and a final directory name (all numbers and lowercase letters, no spaces).'

  const upperCaseCheck = /(.*[A-Z].*)/
  if (upperCaseCheck.test(codeDir))
    return `The appName '${appName}' contains at least one capital, which create-react-app does not permit.  Please enter a new path...`

  if (await fs.pathExists(codeDir))
    return `There already exists a directory ${codeDir}.  Either delete the directory and try again or give a new name.  Please enter a path again...`

  return ''
}

export async function getCodeDir(codeDir: string | undefined) {
  let prompt = 'Please enter a path for your app.  The actual directory of the app must be all numbers and lowercase letters, with no spaces.'
  if (codeDir) {
    prompt = await testCodeDir(codeDir)
  }
  if (prompt.length === 0) return codeDir

  return promptUser(
    'codeDir',
    promptTypes.TEXT,
    prompt,
    testCodeDir,
  )
}
