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
  }

  static examples = [
    '$ ns newstarter -t ~/ns/templates/basicTemplate -s ~/ns/starters/mystarter -c ~/ns/samples/out',
  ]
  // static args = [{name: 'file'}]

  async run() {
    checkForUpdates()

    const {flags} = this.parse(Newstarter)
    const starterDir = flags.starterDir || ''
    if (starterDir.length === 0) isRequiredForNewStarter('starterDir', '-s')
    const templateDir = flags.templateDir || ''
    if (templateDir.length === 0) isRequiredForNewStarter('templateDir', '-t')
    const sampleDir = flags.sampleDir || ''

    const newAppTasks = await createStarter(starterDir, templateDir, sampleDir)
    await newAppTasks.run().catch((error: any) => {
      this.error(error)
    })

    this.log('see documentation: https://github.com/NoStackApp/ns-flip/wiki')
    // shell.exec(`/home/yisrael/projects/ns-cli/bin/create-no-stack-app "${appDir}"`)
  }
}
