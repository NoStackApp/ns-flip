const chalk = require('chalk')
const execa = require('execa')

export function installDevPackagesTaskList(devInstallation: string[], starterDir: string) {
  return devInstallation.map((item: string) => {
    return {
      title: item,
      task: async () => {
        await execa('npm',
          ['install', '--prefix', starterDir, '--save-dev', item],).catch((error: any) => {
          throw new Error(`${chalk.red(`error installing ${item}.`)} You may try installing ${item} directly by running 'npm install --save ${item}' directly and see what messages are reported. Here is the error reported:\n${error}`)
        },)
      },
    }
  },)
}
