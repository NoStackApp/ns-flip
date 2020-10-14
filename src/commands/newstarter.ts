import {Command, flags} from '@oclif/command'

import {createStarter} from '../apps/createStarter'
import {isRequired} from '../inputs/isRequired'

function isRequiredForNewStarter(paramName: string, flag: string) {
  return isRequired(paramName, 'newstarter', flag)
}

export default class Newstarter extends Command {
  static description = 'create new starter from a template.  You can then generate a new code base from it using `newCode`.'

  static flags = {
    help: flags.help({char: 'h'}),
    templateDir: flags.string({char: 't', description: 'template directory'}),
    starterDir: flags.string({char: 's', description: 'starter directory'}),
  }

  static examples = [
    '$ ns newstarter -t ~/templates/basicTemplate -s ~/temp/mystarter',
  ]
  // static args = [{name: 'file'}]

  async run() {
    const {flags} = this.parse(Newstarter)
    const starterDir = flags.starterDir || ''
    if (starterDir.length === 0) isRequiredForNewStarter('starterDir', '-s')
    const templateDir = flags.templateDir || ''
    if (templateDir.length === 0) isRequiredForNewStarter('templateDir', '-t')

    const newAppTasks = await createStarter(starterDir, templateDir)
    await newAppTasks.run().catch((error: any) => {
      this.error(error)
    })
    // shell.exec(`/home/yisrael/projects/ns-cli/bin/create-no-stack-app "${appDir}"`)
  }
}
