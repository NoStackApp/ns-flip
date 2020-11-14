import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'
import {sendRequest} from '../contact/sendRequest'
import {magicStrings} from '../constants'

export default class Contact extends Command {
  static description = 'send feedback or request to ns-flip.  Optionally provide email and other fields.'

  static flags = {
    help: flags.help({char: 'h'}),
    email: flags.string({char: 'e', description: 'email of sender'}),

    // force: flags.boolean({char: 'f', description: 'when force is used, ' +
    //     'the generation is done without a check for potential loss of changes.'}),
  }

  static examples = [
    '$ ns contact "generate is breaking" -e pauljones123@gmail.com',
  ]

  static args = [
    {
      name: 'message',
      required: false,
      description: 'the message to send',
      hidden: false,               // hide this arg from help
    },

  ]

  async run() {
    checkForUpdates()

    const {args, flags} = this.parse(Contact)
    const message = args.message || 'test'

    const email = flags.email
    // let emailEntry = ''
    //
    // if (email) {
    //   emailEntry = ` -d "entry.1551316295=${email}"`
    // }

    // const url2 = 'https://docs.google.com/forms/u/4/d/e/1FAIpQLSdW_SX24EEvtMatR0yD6zdrN71rnbMCUjLLMXz6akkV0sQS1Q/formResponse'

    // const payload = 'entry.1563192314=checking+into+404+error&entry.7330959=this+test&entry.1551316295=yyakovson613%40gmail.com&entry.2118049504=Message'
    // const url = 'https://docs.google.com/forms/d/1DooR4toIL-15Ozk6cxB1A8gMJR5e3dntalYAr60PM9Q' +
    //   '/formResponse -d "entry.1563192314=generate"' +
    //   ' -d "entry.2118049504=Suggestion"' +
    //   ` -d "entry.7330959=${message}"` +
    //   emailEntry
    //   ' -d submit=Submit'
    const url = 'https://docs.google.com/forms/d/1DooR4toIL-15Ozk6cxB1A8gMJR5e3dntalYAr60PM9Q' +
      '/formResponse'
    const payload = {
      'entry.1563192314': 'generate',
      'entry.2118049504': 'Suggestion',
      'entry.7330959': 'message',
      'entry.1551316295': email,
      submit: 'Submit',
    }
    try {
      const result = await sendRequest(url, payload)
      this.log(`result = ${JSON.stringify(result)}`)
    } catch (error) {
      throw new Error(`problem sending message: ${error}`)
    }

    this.log(`Message has been sent.  Thanks!  For documentation: ${magicStrings.DOCUMENTATION}`)
    // shell.exec(`/home/yisrael/projects/ns-cli/bin/create-no-stack-app "${codeDir}"`)
  }
}
