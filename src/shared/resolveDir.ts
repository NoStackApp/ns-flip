import resolve from 'resolve-dir-fixed'

export function resolveDir(rawCodeDir: string|undefined) {
  // const expanded = expandTilde(rawCodeDir)
  return resolve(rawCodeDir)
}
