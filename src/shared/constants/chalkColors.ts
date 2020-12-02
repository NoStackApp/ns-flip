import * as chalk from 'chalk'

export const explanation = (text: string) => chalk.yellow(text)
export const attention = (text: string) => chalk.red(text)
export const userValue = (text: string) => chalk.green(text)
export const menuOption = (text: string) => chalk.blueBright(text)
export const progress = (text: string) => chalk.greenBright(text)
