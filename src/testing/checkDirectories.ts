import {logEntry} from './logEntry'

const fs = require('fs-extra')
const diff = require('arr-diff')

const permittedSrcDirectories = [
  'App.js',
  'App.min.css',
  'App.test.js',
  'client',
  'components',
  'config',
  'context',
  'custom',
  'flattenData',
  'images',
  'index.css',
  'index.js',
  'logo.svg',
  'mediaQuery.js',
  'scss',
  'serviceWorker.js',
  'setupTests.js',
]

const permittedCompDirectories = [
  'AppFooter',
  'AppHeader',
  'AuthTabs',
  'DeleteInstanceMenu',
  'EditInstanceForm',
  'ForgotPasswordButton',
  'FormInput',
  'LoginForm',
  'NavBar',
  'RegistrationForm',
  'source-props',
]

export async function checkDirectories(
  appDir: string,
  logFile: string,
  problemsFound: boolean,
) {
  const testDir = `${appDir}.test`
  const appSrc = `${appDir}/src`
  const testSrc = `${testDir}/src`
  const appComponents = `${appSrc}/components`
  const testComponents = `${testSrc}/components`

  try {
    const srcDirContents = fs.readdirSync(appSrc)
    const compDirContents = fs.readdirSync(appComponents)
    // console.log(`compDirContents = ${JSON.stringify(compDirContents)}`)
    const testCompDirContents = fs.readdirSync(testComponents)

    const extraFiles = diff(srcDirContents, permittedSrcDirectories)
    // const testDirContents = fs.readdirSync(testSrc)

    if (extraFiles.length > 0) {
      problemsFound = true
      const logMessage = `
**** extra files found in the ${appDir}/src directory!!
You have the following files or directories that should not be found:
\t${extraFiles.join('\n\t')}
If you have extra code, it belongs in the custom directory.  Code specific to
state can be stored in the context directory.****`
      await logEntry(logFile, logMessage, true)
    }

    const extraComponentFiles = diff(
      diff(compDirContents, testCompDirContents),
      permittedCompDirectories)

    if (extraComponentFiles.length > 0) {
      problemsFound = true
      const logMessage = `
**** extra files found in the ${appComponents} directory!!
You have the following files or directories that should not be found:
\t${extraComponentFiles.join('\n\t')}
If you have extra code, it belongs in the custom directory.  Code specific to
state can be stored in the context directory.****`
      await logEntry(logFile, logMessage, true)
    }
  } catch (error) {
    throw error
  }
  return problemsFound
}
