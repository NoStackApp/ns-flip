const path = require('path')

export const codeNameFromPath = (codeDir: string) => {
  if (codeDir === '.') return path.basename(path.resolve())
  return path.basename(codeDir) // codeDir.match(/([^\/]*)\/*$/)![1].substring(2)
}
