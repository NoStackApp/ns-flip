import {CommandSpec, Configuration} from '../../../shared/constants/types/configuration'
import * as chalk from 'chalk'

const inquirer = require('inquirer')
const prompt = inquirer.createPromptModule()
const isInteractive = {
  YES: 'Interactive',
  NO: 'Not Interactive',
}

interface AnswersForPreCommands {
    command: string;
    interactive: string;
    askAgain: boolean;
}

const questionsForPreCommands = [
  {
    type: 'input',
    name: 'command',
    message: `Enter any ${chalk.red('preCommands')} (commands that you want executed initially, ` +
            "such as 'create-react-app')\n" +
      chalk.red('NOTE') + ": the directory of a current generated code base is '$codeDir'.\n" +
      chalk.red('NOTE') + ': use `npx` for a cli that your user may not have installed globally.\n' +
      chalk.green('EXAMPLE1') + '`npx create-react-app $codeDir`\n' +
      chalk.green('EXAMPLE2') + '`git init $codeDir`\n' +
      'Just hit enter to finish.',
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

export async function getPreCommands(config: Configuration) {
  try {
    const answers: AnswersForPreCommands = await prompt(questionsForPreCommands)

    if (!answers.interactive) return
    const commandContents = answers.command.split(' ')
    const file = commandContents.shift()
    if (!file) return
    const commandSpec: CommandSpec = {
      title: `run ${file}`,
      file,
      arguments: commandContents,
    }

    if (!config.setupSequence)
      config.setupSequence = {}

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
  } catch (error) {
    // console.error(error)
    throw new Error(`problem getting answers about setup preCommands: ${error}`)
  }
}
