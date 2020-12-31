import {getCodeDir} from '../../inputs/getCodeDir'
import {errorMessage} from '../../shared/errorMessage'

const chalk = require('chalk')
const fs = require('fs-extra')
const Listr = require('listr')

export async function createNewCode(codeDir: string,
  starterDir: string) {
  const tasksCopyFromBaseApp = new Listr([
    {
      title: 'Check for baseApp',
      task: async () => {
        const isBaseApp = await fs.pathExists(starterDir)

        if (!isBaseApp) {
          throw new Error(errorMessage(`the folder for ${starterDir} does not exist. Please confirm it or create it separately`))
        }
      },
    },
    {
      title: 'Copy directory to new app directory',
      task: async () => {
        const finalCodeDir = await getCodeDir(codeDir) || ''

        await fs.copy(starterDir, finalCodeDir).catch((error: any) => {
          throw new Error(`${chalk.red(`error copying over from ${starterDir}.`)} Here is the error reported:\n${error}`)
        },)
      },
    },
  ])
  return tasksCopyFromBaseApp
}
