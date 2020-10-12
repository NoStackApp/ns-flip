const path = require('path')

export const appNameFromPath = (appDir: string) => {
  if (appDir === '.') return path.basename(path.resolve())
  return path.basename(appDir) // appDir.match(/([^\/]*)\/*$/)![1].substring(2)
}
