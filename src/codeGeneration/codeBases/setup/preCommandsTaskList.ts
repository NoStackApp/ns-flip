import {CommandSpec} from '../../../shared/constants/types/configuration'
import {convertCommandArgs} from './convertCommandArgs'
import {convertCommandOptions} from './convertCommandOptions'
import {replaceGlobalValuesInObject} from '../settings/specs/replaceGlobalValuesInObject'

const chalk = require('chalk')
const execa = require('execa')

export function preCommandsTaskList(
  preCommands: CommandSpec[],
  starterDir: string,
  session: any
) {
  const preCommandsInfo = preCommands.map(object => replaceGlobalValuesInObject(
    object, session, {}
  )).filter(x => !x.prevent)

  return preCommandsInfo.map((commandSpec: CommandSpec) => {
    return {
      title: commandSpec.title,
      task: async () => {
        await execa(
          commandSpec.file,
          convertCommandArgs(commandSpec.arguments, starterDir),
          convertCommandOptions(commandSpec.options, starterDir),
        ).catch((error: any) => {
          throw new Error(`${chalk.red(`error with pre-command ${commandSpec.title}.`)}
Here is the information about the command: ${JSON.stringify(
    commandSpec, null, 1
  )}
You may try contacting the author of your template to see what they suggest.
Here is the error reported:\n${error}`)
        },)
      },
    }
  },)
}
