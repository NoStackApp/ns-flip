import {CommandSpec, Configuration} from '../../shared/constants/types/configuration'
import {preCommandsTaskList} from '../../codeGeneration/codeBases/setup/preCommandsTaskList'
import {interactiveSequence} from "../../codeGeneration/codeBases/setup/interactiveSequence";

const inquirer = require('inquirer')
const Listr = require('listr')

export async function runPreCommands(preCommands: CommandSpec[], starterDir: string) {
  if (!preCommands) return
  const commandsListr = new Listr(preCommandsTaskList(preCommands, starterDir))
  try {
    await commandsListr.run()
  } catch (error) {
    throw new Error(`cannot execute preCommands for ${starterDir}: ${error}`)
  }
}

const isInteractive = {
  YES: 'Interactive',
  NO: 'Not Interactive',
}

interface AnswersForPreCommands{
  command: string;
  interactive: string;
  askAgain: boolean;
}

const questionsForPreCommands = [
  {
    type: 'input',
    name: 'command',
    message: 'Please enter a command that you want executed initially, ' +
      "such as 'create-react-app'? If so, enter the first now.  If you need to " +
      "specify the directory of a current generated code base, use '$codeDir'.  " +
      'For instance, `git init $codeDir`. If there are no additional commands that you' +
      ' need executed, just hit enter.',
  },
  {
    type: 'list',
    name: 'interactive',
    message: 'Does the user have to run this interactively?  (Does it require' +
      'user input?)',
    choices: [isInteractive.NO, isInteractive.YES],
    default: isInteractive.NO,
    when: function (answers: AnswersForPreCommands) {
      return (answers.command !== '')
    },
  },
  {
    type: 'confirm',
    name: 'askAgain',
    message: 'Do you want to enter another command? (just hit enter for YES)?',
    default: true,
    when: function (answers: AnswersForPreCommands) {
      return (answers.command !== '')
    },

  },
]

async function getPreCommands(config: Configuration) {
  try {
    const answers: AnswersForPreCommands = await inquirer.prompt(questionsForPreCommands)

    if (!answers.interactive) return
    const commandContents = answers.command.split(' ')
    const file = commandContents.shift()
    if (!file) return
    console.log(`commandContents=${JSON.stringify(commandContents)}`)
    const commandSpec: CommandSpec = {
      title: `run ${file}`,
      file,
      arguments: commandContents,
    }

    console.log(`arguments=${JSON.stringify(commandSpec.arguments)}`)

    if (answers.interactive === isInteractive.NO) {
      if (config.setupSequence.preCommands)
        config.setupSequence.preCommands.push(commandSpec)
      else
        config.setupSequence.preCommands = [commandSpec]
    }

    if (answers.interactive === isInteractive.YES) {
      if (config.setupSequence.interactive)
        config.setupSequence.interactive.push(commandSpec)
      else
        config.setupSequence.interactive = [commandSpec]
    }

    if (answers.askAgain)
      await getPreCommands(config)
    else {
      console.log(JSON.stringify(answers, null, '  '))
      console.log(JSON.stringify(config.setupSequence, null, '  '))
    }
  } catch (error) {
    throw new Error(`problem getting answers about setup preCommands: ${error}`)
  }
}

export async function setPreCommands(config: Configuration, starterDir: string) {
  await getPreCommands(config)

  try {
    if (config.setupSequence.interactive)
      await interactiveSequence(config.setupSequence.interactive, starterDir)
    if (config.setupSequence.preCommands)
      await runPreCommands(config.setupSequence.preCommands, starterDir)
  } catch (error) {
    console.error(error)
    throw new Error(`problem with running preCommands: ${error}`)
  }
}
