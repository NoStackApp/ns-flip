import {standardIgnored, suffixes} from '../constants'
const fs = require('fs-extra')

export async function ensureIgnoredExist(codeDir: string) {
  const backupDir = `${codeDir}${suffixes.BACKUP_DIR}`
  await Promise.all(standardIgnored.map(async fileOrFolder => {
    if (fs.existsSync(`${backupDir}/${fileOrFolder}`)) {
      await fs.remove(`${codeDir}/${fileOrFolder}`)
      await fs.copy(`${backupDir}/${fileOrFolder}`, `${codeDir}/${fileOrFolder}`)
    }
  }))
}
