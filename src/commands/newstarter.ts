import {Command, flags} from '@oclif/command'

import {createStarter} from '../apps/createStarter'
import {isRequired} from '../inputs/isRequired'
import {checkForUpdates} from '../shared/checkForUpdates'

function isRequiredForNewStarter(paramName: string, flag: string) {
  return isRequired(paramName, 'newstarter', flag)
}

export default class Newstarter extends Command {
  static description = 'create new starter from a template.  You can then generate a new code base from it using `newCode`.'

  static flags = {
    help: flags.help({char: 'h'}),
    templateDir: flags.string({char: 't', description: 'template directory'}),
    starterDir: flags.string({char: 's', description: 'starter directory'}),
    sampleDir: flags.string({char: 'c', description: 'optional sample generated code directory'}),
    force: flags.boolean({char: 'f', description: 'when force is used, the starter is overwritten without warning.'}),
  }

  static examples = [
    '$ ns newstarter -t ~/ns/templates/basicTemplate -s ~/ns/starters/mystarter',
    '$ ns newstarter -t $TEMPLATE -s $STARTER -c ~/ns/samples/out',
    '$ ns newstarter -t $TEMPLATE -s $STARTER -c $CODE -f',
  ]
  // static args = [{name: 'file'}]

  async run() {
    checkForUpdates()

    const {flags} = this.parse(Newstarter)
    const force = flags.force
    const starterDir = flags.starterDir || ''
    if (starterDir.length === 0) isRequiredForNewStarter('starterDir', '-s')
    const templateDir = flags.templateDir || ''
    if (templateDir.length === 0) isRequiredForNewStarter('templateDir', '-t')
    const sampleDir = flags.sampleDir || ''

    const newAppTasks = await createStarter(starterDir, templateDir, sampleDir, force)
    await newAppTasks.run().catch((error: any) => {
      this.error(error)
    })

    this.log('Created the starter.  For documentation: https://github.com/NoStackApp/ns-flip/wiki')
    // shell.exec(`/home/yisrael/projects/ns-cli/bin/create-no-stack-app "${appDir}"`)
  }
}
