import {CommandSpec, Configuration} from '../../../shared/constants/types/configuration'

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
