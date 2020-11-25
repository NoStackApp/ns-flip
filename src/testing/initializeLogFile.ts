import {logEntry} from './logEntry'
import {links} from '../shared/constants'

const date = new Date()
const initializedTestMessage =
  `This file was created by running the ns-front check command on ${date.toLocaleString()}.
See ${links.DOCUMENTATION} for more info.
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

