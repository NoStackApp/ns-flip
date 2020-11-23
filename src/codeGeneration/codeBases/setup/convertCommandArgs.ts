export function convertCommandArgs(args: string[] | undefined, codeDir: string) {
  if (!args || args.length === 0) return []
  // const output = args.map((arg: string) => arg.replace('$codeDir', codeDir)).push(`>> ${LOGFILE}`)
  const output = args.map((arg: string) => arg.replace('$codeDir', codeDir))
  // output.push(`>> ${LOGFILE}`)
  return output
}
