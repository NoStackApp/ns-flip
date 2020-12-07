const resolve = require('path').resolve

export function resolveDir(rawCodeDir: string|undefined) {
  return resolve(rawCodeDir)
}
