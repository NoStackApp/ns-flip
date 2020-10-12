import {logEntry} from './logEntry'

const date = new Date()
const initializedTestMessage =
  `This file was created by running the ns-front test command on ${date.toLocaleString()}.
See https://www.npmjs.com/package/ns-front for more info.
-------------------------------------------------------------------------------
`

export async function initializeLogFile(
  logFile: string,
) {
  try {
    await logEntry(logFile, initializedTestMessage, false)
  } catch (error) {
    throw error
  }
}

