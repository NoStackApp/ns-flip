import {Command, flags} from '@oclif/command'
import {links, names} from '../constants'
import {checkForUpdates} from '../shared/checkForUpdates'
import {checkNodeVersion} from '../shared/checkNodeVersion'
import {isRequired} from '../shared/isRequired'
import {failsTests} from '../testing/failsTests'
import {logEntry} from '../testing/logEntry'

const descriptionString = 'Confirms that your custom changes have been entered safely, ' +
  `allowing you to generate with an updated or replaced template, or with a changed '${names.NS_FILE}' file. ` +
  'For documentation about the rules for custom code placement, ' +
  'please see https://github.com/NoStackApp/ns-flip/wiki/Safe-Custom-Code.\n' +
  '\n' +
  'Essentially, the test generates a new version of the code ' +
  'and then simply compares it against your current version.  ' +
  'If there are differences, then there is a problem with your code.'

export default class Test extends Command {
  static description = String(descriptionString)

  static examples = [
    '$ ns test -c ~/temp/myApp',
  ];

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    codeDir: flags.string({char: 'c', description: 'code base directory'}),
  };

  static args = [];

  async run() {
    checkNodeVersion()
    checkForUpdates()

    const {flags} = this.parse(Test)
    const codeDir = flags.codeDir || isRequired('appDir', 'test', 'c')

    const testDir = `${codeDir}${names.TEST_DIR_SUFFIX}`
    const testMetaDir = `${testDir}/${names.META_DIR}`

    const diffsFile = `${testMetaDir}/${names.DIFFS}`
    const logFile = `${testMetaDir}/${names.TESTS_LOG}`

    const problemsFound = await failsTests(codeDir)

    let logMessage = `
You will find all files showing discrepancies in the file ${diffsFile}.
Any discrepancy shown is a problem. See ${links.NS_RULES} for more info
about NoStack compatible code.  For specific instructions to resolve
discrepancies, see ${links.TEST_RESULTS}. `
    if (problemsFound) {
      this.log(`

:( The app did not pass the tests. :(
See the log file ${logFile} or the above messages for more information.`)
      await logEntry(logFile, `

:( The app did not pass the tests. :(`, false)
      await logEntry(logFile, logMessage, true)
      return 1
    }

    logMessage = `
:) The app is passing all tests! :)`
    await logEntry(logFile, logMessage, true)
    return 0
  }
}
