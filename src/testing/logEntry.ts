const fs = require('fs-extra')

export async function logEntry(
  logFile: string,
  logMessage: string,
  sendToConsole: boolean
) {
  try {
    fs.appendFile(logFile, logMessage)
  } catch (error) {
    throw error
  }

  if (sendToConsole)
    // eslint-disable-next-line no-console
    console.log(logMessage)
}
