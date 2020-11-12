import {Command, flags} from '@oclif/command'

import {checkForUpdates} from '../shared/checkForUpdates'
import {magicStrings, suffixes} from '../constants'
import {createCodeBase} from '../apps/createCodeBase'

export default class Generate extends Command {
  static description = 'generates code based on a template and an \'ns file\'.  ' +
    'To set the template, you need the template flag.'

  static flags = {
    help: flags.help({char: 'h'}),
    templateDir: flags.string({char: 't', description: 'template directory'}),
    // force: flags.boolean({char: 'f', description: 'when force is used, ' +
    //     'the generation is done without a check for potential loss of changes.'}),
  }

  static examples = [
    '$ ns generate ~/ns/samples/out -t ~/ns/templates/basicTemplate',
    '$ ns generate ~/ns/samples/out',
  ]

  static args = [
    {
      name: 'codeDir',
      required: true,
      description: 'directory containing the code to check',
      hidden: false,               // hide this arg from help
    },

  ]

  async run() {
    checkForUpdates()

    const {args, flags} = this.parse(Generate)
    const codeDir = args.codeDir

    // const force = flags.force
    const templateDir = flags.templateDir
    const starterDir = codeDir + suffixes.STARTUP_DIR

    try {
      const newAppTasks = await createCodeBase(starterDir, templateDir, codeDir)
      await newAppTasks.run().catch((error: any) => {
        this.error(error)
      })
    } catch (error) {
      throw new Error(`Problem creating starter: ${error}`)
    }

    this.log(`Generated the code at ${codeDir}.  For documentation: ${magicStrings.DOCUMENTATION}`)
    // shell.exec(`/home/yisrael/projects/ns-cli/bin/create-no-stack-app "${appDir}"`)
  }
}
