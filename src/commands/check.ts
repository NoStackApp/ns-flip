import {Command, flags} from '@oclif/command'
import {links, dirNames, fileNames, suffixes} from '../shared/constants'
import {checkForUpdates} from '../shared/checkForUpdates'
import {failsTests} from '../testing/failsTests'
import {logEntry} from '../testing/logEntry'
import {resolveDir} from '../shared/resolveDir'

const descriptionString = 'Confirms that your custom changes have been entered safely, ' +
  `allowing you to generate with an updated or replaced template, or with a changed '${fileNames.NS_FILE}' file. ` +
  'Essentially, generates a new version of the code ' +
  'and then simply compares it against your current version.  ' +
  'If there are differences, then there is a problem with your code.' +
  ' For documentation about safe custom code changes, ' +
  `please see ${links.DOCUMENTATION}/Safe-Custom-Code.`

export default class Check extends Command {
  static description = String(descriptionString)

  static examples = [
    '$ ns check ~/projects/myapp',
  ];

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
  };

  static args = [
    {
      name: 'codeDir',
      required: true,
      description: 'directory containing the code to check',
      hidden: false,               // hide this arg from help
    },
  ];

  async run() {
    checkForUpdates()

    const {args} = this.parse(Check)
    const codeDir = resolveDir(args.codeDir)

    const testDir = `${codeDir}${suffixes.TEST_DIR}`
    const testMetaDir = `${testDir}/${dirNames.META}`

    const diffsFile = `${testMetaDir}/${fileNames.DIFFS}`
    const logFile = `${testMetaDir}/${fileNames.TESTS_LOG}`

    const problemsFound = await failsTests(codeDir)

    let logMessage = `
You will find all files showing discrepancies in the file ${diffsFile}.
Any discrepancy shown is a problem. See ${links.SAFE_CODE_RULES} for more info
about NoStack compatible code.  For specific instructions to resolve
discrepancies, see ${links.TEST_RESULTS}. `
    if (problemsFound) {
      this.log(`

:( The app did not pass the tests. :(
See the log file ${logFile} or the above messages for more information.`)
      await logEntry(logFile, `

:( The app did not pass the tests. :(`, false)
      await logEntry(logFile, logMessage, true)

      this.log(`For documentation: ${links.TEST_RESULTS}`)

      return 1
    }

    logMessage = `
:) The app is passing all tests! :)`
    await logEntry(logFile, logMessage, true)

    this.log(`Finished the test.  For documentation: ${links.DOCUMENTATION}`)

    return 0
  }
}
