import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'

import {compareSync, Result} from 'dir-compare'

// const expandTilde = require('expand-tilde')
// const path = require('path')

export default class Resolvediffs extends Command {
  static description = 'create new template.'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static examples = [
    '$ ns resolvediffs',
  ]

  async run() {
    checkForUpdates()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {flags} = this.parse(Resolvediffs)

    try {
      const sample = '/home/yisroel/ns2/samples/projectory'
      const code = '/home/yisroel/ns2/samples/ez-oclif-cli-code'

      // Synchronous
      const res: Result = compareSync(sample, code, {
        excludeFilter: '.git,node_modules',
        compareContent: true,
      })
      this.log(JSON.stringify(res., null, 2))
    } catch (error) {
      this.log(error)
      this.error(`cannot compare directories: ${error}`)
    }
  }
}
