import {names} from '../constants'
import {dirOptions} from '../shared/dirOptions'
import {getCodeInfo} from '../shared/getCodeInfo'
import {getConfiguration} from '../shared/getConfiguration'
import {CustomCodeRepository} from '../constants/types/custom'

import {errorMessage} from '../shared/errorMessage'
import {error} from 'util'
import {CommandSpec, Configuration} from '../constants/types/configuration'

const chalk = require('chalk')
const execa = require('execa')
const fs = require('fs-extra')
const Listr = require('listr')
const yaml = require('js-yaml')

function convertCommandArgs(args: string[]|undefined, codeDir: string) {
  if (!args) return []
  // const output = args.map((arg: string) => arg.replace('$appDir', appDir)).push(`>> ${LOGFILE}`)
  const output = args.map((arg: string) => arg.replace('$appDir', codeDir))
  // output.push(`>> ${LOGFILE}`)
  return output
}

async function spawnInteractiveChildProcess(commandSpec: CommandSpec) {
  await execa(
    commandSpec.file,
    commandSpec.arguments,
    commandSpec.options,
  ).catch(
    (error: any) => {
      console.log(error)
      throw new Error(`error with executing ${commandSpec.file}: ${error}`)
    },
  )
}

async function checkFolder(starterDir: string) {
  const isAppFolder = await fs.pathExists(starterDir)

  if (isAppFolder) {
    throw new Error(errorMessage(`a folder for ${starterDir} already exists. Please choose a different app name`))
  }

  const upperCaseCheck = /(.*[A-Z].*)/
  if (upperCaseCheck.test(starterDir)) {
    throw new Error(errorMessage(`The ${starterDir} contains at least one capital, which create-react-app does not permit.`))
  }
}

async function interactiveSequence(commandSpecs: CommandSpec[], codeDir: string) {
  let i
  for (i = 0; i < commandSpecs.length; i++) {
    const commandSpec = {...commandSpecs[i]}
    if (!commandSpec) {
      continue
    }

    commandSpec.arguments = convertCommandArgs(commandSpec.arguments, codeDir)

    if (!commandSpec.options) commandSpec.options = {}
    commandSpec.options.stdio = 'inherit'
    console.log(`commandSpec=${JSON.stringify(commandSpec)}`)
    await spawnInteractiveChildProcess(commandSpec)
  }
}

export async function createStarter(
  starterDir: string,
  templateDir: string,
) {
  const config: Configuration = await getConfiguration(templateDir)
  const {placeholderAppCreation} = config
  const {mainInstallation, devInstallation, preCommands, interactive} = placeholderAppCreation

  await checkFolder(starterDir)
  if (interactive) await interactiveSequence(interactive, starterDir)
  // await execa(
  //   'oclif',
  //   ['multi', 'foo'],
  //   {stdio: 'inherit'},
  // ).catch(
  //   (error: any) => {
  //     console.log(error)
  //     throw new Error(`error with oclif: ${error}`)
  //   },
  // )

  // const oclifCommandSpec: CommandSpec = {
  //   file: 'oclif',
  //   arguments: ['multi', 'foo'],
  //   options: {stdio: 'inherit'},
  // }
  //
  // await spawnInteractiveChildProcess(oclifCommandSpec)

  const tasksFullInstallation = new Listr([
    {
      title: 'Execute Pre-Commands',
      task: async () => {
        if (!preCommands) return
        return new Listr(preCommands.map((commandSpec: CommandSpec) => {
          return {
            title: commandSpec.title,
            task: async () => {
              await execa(
                commandSpec.file,
                convertCommandArgs(commandSpec.arguments, starterDir),
                commandSpec.options,
              ).catch(
                (error: any) => {
                  throw new Error(`${chalk.red(`error with pre-command ${commandSpec.title}.`)}
Here is the information about the command: ${JSON.stringify(commandSpec, null, 1)}
You may try contacting the author of your template to see what they suggest.
Here is the error reported:\n${error}`)
                },
              )
            },
          }
        },
        ))
      },
    },
    {
      title: 'Install General Packages...',
      task: async () => {
        if (!mainInstallation) return
        return new Listr(mainInstallation.map((item: string) => {
          return {
            title: item,
            task: async () => {
              await execa(
                'npm',
                ['install', '--prefix', starterDir, '--save', item],
              ).catch(
                (error: any) => {
                  throw new Error(`${chalk.red(`error installing ${item}.`)} You may try installing ${item} directly by running 'npm install --save ${item}' directly and see what messages are reported. Here is the error reported:\n${error}`)
                },
              )
            },
          }
        },
        ))
      },
    },
    {
      title: 'Install Dev Packages...',
      task: async () => {
        if (!devInstallation) return
        return new Listr(devInstallation.map((item: string) => {
          return {
            title: item,
            task: async () => {
              await execa(
                'npm',
                ['install', '--prefix', starterDir, '--save-dev', item],
              ).catch(
                (error: any) => {
                  throw new Error(`${chalk.red(`error installing ${item}.`)} You may try installing ${item} directly by running 'npm install --save ${item}' directly and see what messages are reported. Here is the error reported:\n${error}`)
                },
              )
            },
          }
        },
        ))
      },
    },
    {
      title: 'Add Meta-Data',
      task: async () => {
        const metaDir = `${starterDir}/${names.META_DIR}`
        const nsYml = `${metaDir}/${names.NS_FILE}`
        const customCode = `${metaDir}/${names.CUSTOM_CODE_FILE}`
        const appInfo = await getCodeInfo(`${templateDir}/sample.${names.NS_FILE}`)
        appInfo.starter = starterDir
        const customCodeRepository: CustomCodeRepository = {
          addedCode: {},
          replacedCode: {},
          removedCode: {},
        }

        try {
          await fs.ensureDir(metaDir, dirOptions)
          await fs.outputFile(nsYml, yaml.safeDump(appInfo))
          await fs.outputJson(customCode, customCodeRepository)
          // console.log('success creating dirs')
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        }
      },
    },
  ])

  return tasksFullInstallation
  // logProgress(`${chalk.green('Installation is complete!')} Run the other utilities to create the full app`)
}
