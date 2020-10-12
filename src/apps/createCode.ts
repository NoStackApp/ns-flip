import {getAppDir} from '../inputs/getAppDir'
import {errorMessage} from '../constants/errorMessage'

const chalk = require('chalk')
const execa = require('execa')
const fs = require('fs-extra')
const Listr = require('listr')

export async function createCode(
  codeDir: string,
  starterDir: string,
) {
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
        const finalAppDir = await getAppDir(codeDir) || ''

        await execa(
          'cp',
          ['-r', starterDir, finalAppDir],
        ).catch(
          (error: any) => {
            throw new Error(`${chalk.red(`error copying over from ${starterDir}.`)} Here is the error reported:\n${error}`)
          },
        )
      },
    },
  ])
  return tasksCopyFromBaseApp
}
