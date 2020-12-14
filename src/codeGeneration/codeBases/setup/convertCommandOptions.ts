export function convertCommandOptions(options: any | undefined, codeDir: string) {
  if (!options) return {}
  const optionsKeys = Object.keys(options)
  if (!optionsKeys || optionsKeys.length === 0) return {}
  const output = {...options}
  optionsKeys.map((optionKey: string) => {
    output[optionKey] = options[optionKey].replace('$codeDir', codeDir)
  })
  return output
}
