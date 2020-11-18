export function removeNpmDependencyPrefix(dependency: string) {
  return dependency.replace('^', '').replace('~', '')
}
