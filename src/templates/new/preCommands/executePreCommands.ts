import {CommandSpec, Configuration} from '../../../shared/constants/types/configuration'
import {preCommandsTaskList} from '../../../codeGeneration/codeBases/setup/preCommandsTaskList'
import {interactiveSequence} from '../../../codeGeneration/codeBases/setup/interactiveSequence'

const Listr = require('listr')

export async function runPreCommands(
  preCommands: CommandSpec[], starterDir: string, session: any
) {
  if (!preCommands) return
  const commandsListr = new Listr(preCommandsTaskList(
    preCommands, starterDir, session
  ))
  try {
    await commandsListr.run()
  } catch (error) {
    throw new Error(`cannot execute preCommands for ${starterDir}: ${error}`)
  }
}

export async function executePreCommands(
  config: Configuration, starterDir: string, session: any
) {
  if (!config.setupSequence) return
  try {
    if (config.setupSequence.interactive)
      await interactiveSequence(config.setupSequence.interactive, starterDir)
    if (config.setupSequence.preCommands)
      await runPreCommands(
        config.setupSequence.preCommands, starterDir, session
      )
  } catch (error) {
    // console.error(error)
    throw new Error(`problem with running preCommands: ${error}`)
  }
}
