import {Command, flags} from '@oclif/command'
import {createCode} from '../apps/createCode'

import {isRequired} from '../inputs/isRequired'

function isRequiredForNewCode(paramName: string, flag: string) {
  return isRequired(paramName, 'newapp', flag)
}

export default class Newcode extends Command {
  static description = 'new code base, based on a starter. You can use `generate` to update based on the `ns.yml` file.'

  static flags = {
    help: flags.help({char: 'h'}),
    codeDir: flags.string({char: 'c', description: 'code base directory'}),
    starterDir: flags.string({char: 's', description: 'starter directory.'}),
  }

  static examples = [
    '$ nostack newcode -c ~/temp/myapp -s ~/temp/starter',
  ]
  // static args = [{name: 'file'}]

  async run() {
    const {flags} = this.parse(Newcode)
    const codeDir = flags.codeDir || ''
    if (codeDir.length === 0) isRequiredForNewCode('codeDir', '-c')
    const starterDir = flags.starterDir || ''
    if (codeDir.length === 0) isRequiredForNewCode('starterDir', '-s')

    const newAppTasks = await createCode(codeDir, starterDir)
    await newAppTasks.run().catch((error: any) => {
      this.error(error)
    })
    // shell.exec(`/home/yisrael/projects/ns-cli/bin/create-no-stack-app "${appDir}"`)
  }
}
