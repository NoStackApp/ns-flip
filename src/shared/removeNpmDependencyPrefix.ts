export function removeNpmDependencyPrefix(dependency: string) {
  if (!dependency) return undefined
  return dependency.replace('^', '').replace('~', '')
}
