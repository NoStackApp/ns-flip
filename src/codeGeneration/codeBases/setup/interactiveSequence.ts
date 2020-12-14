import {CommandSpec} from '../../../shared/constants/types/configuration'
import {convertCommandArgs} from './convertCommandArgs'
import {convertCommandOptions} from './convertCommandOptions'

const execa = require('execa')

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

export async function interactiveSequence(commandSpecs: CommandSpec[], codeDir: string) {
  let i
  for (i = 0; i < commandSpecs.length; i++) {
    const commandSpec = {...commandSpecs[i]}
    if (!commandSpec) {
      continue
    }

    commandSpec.arguments = convertCommandArgs(commandSpec.arguments, codeDir)

    if (!commandSpec.options) commandSpec.options = {}
    commandSpec.options = convertCommandOptions(commandSpec.options, codeDir)
    commandSpec.options.stdio = 'inherit'
    await spawnInteractiveChildProcess(commandSpec)
  }
}
