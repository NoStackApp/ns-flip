import * as chalk from 'chalk'

// emphasized (bright)
export const attention = (text: string) => chalk.redBright(text)
export const menuOption = (text: string) => chalk.blueBright(text)
export const exitOption = (text: string) => chalk.yellowBright(text)
export const progress = (text: string) => chalk.greenBright(text)

// updates (background)
export const statusUpdate = (text: string) => chalk.bgGrey(text)

// deemphasized
export const explanation = (text: string) => chalk.yellow(text)
export const userValue = (text: string) => chalk.green(text)
