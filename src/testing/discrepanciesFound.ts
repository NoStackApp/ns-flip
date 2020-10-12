import {logEntry} from './logEntry'

const fs = require('fs-extra')

// // parts of a discrepancy
// const diffStatement = 'diff -rbBw ([^\\s])* ([^\\s])*\\n'
// const locationStatement = '([0-9]|,)*(a|c|d)([0-9]|,)*\\n'
// const firstFileLines = '((< .*\\n)*)'
// const divider = '(---\\n)?'
// const secondFileLines = '((> .*\\n)*)'

// const fullRegExBody = `(?:${diffStatement})?${locationStatement}${firstFileLines}${divider}${secondFileLines}`
// const regEx = new RegExp(fullRegExBody, 'g')

export async function discrepanciesFound(
  diffFile: string,
  logFile: string,
  problemsFound: boolean,
) {
  let diffString = ''
  try {
    if (fs.existsSync(diffFile)) {
      diffString = await fs.readFile(diffFile, 'utf8')
    }
  } catch (error) {
    throw error
  }
  // const matches = diffString.match(regEx)
  if (diffString.length > 0) {
    // if (matches && matches.length > 0) {
    problemsFound = true
    const logMessage = `
*** DISCREPANCIES FOUND!  You can find the discrepancies in ${diffFile}. Please see
https://www.npmjs.com/package/ns-front#working-with-test-results for how to resolve them. ***
`
    try {
      await logEntry(logFile, logMessage, true)
    } catch (error) {
      throw error
    }
  }
  return problemsFound
}
