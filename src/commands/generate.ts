import {Command, flags} from '@oclif/command'

import {checkForUpdates} from '../shared/checkForUpdates'
import {links} from '../shared/constants'
import {createCodeBase} from '../codeGeneration/codeBases/createCodeBase'
import {resolveDir} from '../shared/resolveDir'

export default class Generate extends Command {
  static description = 'generates code based on a template and an \'ns file\'.  ' +
    'To set the template, you need the template flag.'

  static flags = {
    help: flags.help({char: 'h'}),
    templateDir: flags.string({char: 't', description: 'Template directory. Will generate from the template,' +
        ' and will override any prior template or template version used.'}),
    noSetup: flags.boolean({char: 'n', description: 'Do not update the startup' +
        ' routine (this is only relevant when the templateDir flag is also used). Saves a lot of time for a template ' +
        'developer.'}),
    // force: flags.boolean({char: 'f', description: 'when force is used, ' +
    //     'the generation is done without a check for potential loss of changes.'}),
  }

  static examples = [
    '$ ns generate ~/ns/samples/out -t ~/ns/templates/basicTemplate',
    '$ ns generate $CODE -t $TEMPLATE --noSetup',
    '$ ns generate $CODE',
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
    const codeDir = resolveDir(args.codeDir)
    console.log(`resolved codeDir=${codeDir}`)

    // const force = flags.force
    const templateDir = flags.templateDir
    const noSetup = flags.noSetup
    // const starterDir = codeDir + suffixes.STARTUP_DIR

    try {
      await createCodeBase(templateDir, codeDir, noSetup)

      // const newAppTasks = await createCodeBase(starterDir, templateDir, codeDir, noSetup)
      // await newAppTasks.run().catch((error: any) => {
      //   this.error(error)
      // })
    } catch (error) {
      this.log(error)
      throw new Error(`problem generating code: ${error}`)
    }

    this.log(`Generated the code at ${codeDir}.  For documentation: ${links.DOCUMENTATION}`)
    // shell.exec(`/home/yisrael/projects/ns-cli/bin/create-no-stack-app "${codeDir}"`)
  }
}
