import {magicStrings} from '../constants'
import {dirOptions} from '../shared/dirOptions'
import {getCodeInfo} from '../shared/getCodeInfo'
import {getConfiguration} from '../shared/getConfiguration'
import {CustomCodeRepository} from '../constants/types/custom'

import {errorMessage} from '../shared/errorMessage'
import {CommandSpec, Configuration} from '../constants/types/configuration'
// import {getAppDir} from '../inputs/getAppDir'
import {createCode} from './createCode'
import {regenerateCode} from '../codeGeneration/regenerateCode'

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
      throw new Error(`error with executing ${commandSpec.file}: ${error}`)
    },
  )
}

async function checkFolder(starterDir: string, force: boolean) {
  if (force && await fs.pathExists(starterDir)) {
    try {
      await fs.remove(starterDir)
    } catch (error) {
      throw new Error(`cannot remove the starter ${starterDir}: ${error}`)
    }
  }

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
    await spawnInteractiveChildProcess(commandSpec)
  }
}

export async function createStarter(
  starterDir: string,
  templateDir: string,
  sampleDir: string,
  force: boolean,
) {
  const config: Configuration = await getConfiguration(templateDir)
  const {placeholderAppCreation} = config
  if (!placeholderAppCreation) throw new Error('\'newstarter\' cannot run because ' +
    '\'placeholderAppCreation\' is undefined in the config of the template.' +
    ` See ${magicStrings.DOCUMENTATION}/Setup-Sequence.`)

  const {mainInstallation, devInstallation, preCommands, interactive} = placeholderAppCreation

  await checkFolder(starterDir, force)
  if (interactive) await interactiveSequence(interactive, starterDir)

  const taskList = [
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
        const metaDir = `${starterDir}/${magicStrings.META_DIR}`
        const nsYml = `${metaDir}/${magicStrings.NS_FILE}`
        const customCode = `${metaDir}/${magicStrings.CUSTOM_CODE_FILE}`
        const appInfo = await getCodeInfo(`${templateDir}/sample.${magicStrings.NS_FILE}`)
        const customDir = `${starterDir}/${config.dirs.custom}`
        if (appInfo) appInfo.starter = starterDir
        const customCodeRepository: CustomCodeRepository = {
          addedCode: {},
          replacedCode: {},
          removedCode: {},
        }

        try {
          await fs.ensureDir(metaDir, dirOptions)
          await fs.ensureDir(customDir, dirOptions)
          if (appInfo) await fs.outputFile(nsYml, yaml.safeDump(appInfo))
          await fs.outputJson(customCode, customCodeRepository)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        }
      },
    },
  ]

  if (sampleDir) {
    taskList.push(
      {
        title: 'Create Sample Base Code',
        task: async () => {
          return new Listr([
            {
              title: 'Create Sample Base Code if None Exists',
              task: async () => {
                const isSampleBaseAlready = await fs.pathExists(sampleDir)

                if (!isSampleBaseAlready) {
                  try {
                    const newAppTasks = await createCode(sampleDir, starterDir)
                    await newAppTasks.run()
                  } catch (error) {
                    throw new Error(`cannot create sample app at ${sampleDir}: ${error}`)
                  }
                }
              },
            },
            {
              title: 'Create Sample Dir',
              task: async () => {
                await fs.ensureFile(`${sampleDir}/meta/ns.yml`)
                await regenerateCode(sampleDir)
              },
            },
          ])
        },
      }
    )
  }

  return new Listr(taskList)
  // logProgress(`${chalk.green('Installation is complete!')} Run the other utilities to create the full app`)
}
