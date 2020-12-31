export const isRequired = (
  paramName: string, commandName: string, flag: string
) => {
  //   this.log("param ${paramName} is required for this creation)
  //   return

  if (flag && commandName) {
    // eslint-disable-next-line no-console
    console.log(`Error calling command ${commandName}: the parameter '${paramName}' is required.
     You can use the flag '--${paramName}' or '-${flag}'.`)
    // eslint-disable-next-line no-process-exit,unicorn/no-process-exit
    return process.exit(1)
  }

  throw new Error(`param ${paramName} is required for this creation`)
}
