import {codeNameFromPath} from '../inputs/codeNameFromPath'

const fs = require('fs-extra')
export const testCodeDir = async (codeDir: string) => {
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
