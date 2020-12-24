import {dirOptions} from './dirOptions'
const fs = require('fs-extra')

export async function ensureDirectory(dirPath: string) {
  fs.ensureDir(dirPath, dirOptions)
}
