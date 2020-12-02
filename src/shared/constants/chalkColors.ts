import * as chalk from 'chalk'

export const explanation = (text: string) => chalk.yellow(text)
export const exitOption = (text: string) => chalk.red(text)
export const attention = (text: string) => chalk.redBright(text)
export const userValue = (text: string) => chalk.green(text)
export const menuOption = (text: string) => chalk.blueBright(text)
export const progress = (text: string) => chalk.greenBright(text)
export const statusUpdate = (text: string) => chalk.bgGrey(text)
