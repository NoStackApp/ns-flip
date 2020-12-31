import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'
import {sendRequest} from '../contact/sendRequest'
import {links} from '../shared/constants'

export default class Contact extends Command {
  static description = 'send feedback or request to ns-flip.  Optionally provide email and other fields.'

  static flags = {
    help: flags.help({char: 'h'}),
    email: flags.string({char: 'e', description: 'email of sender'}),

    // force: flags.boolean({char: 'f', description: 'when force is used, ' +
    //     'the generation is done without a check for potential loss of changes.'}),
  }

  static examples = [
    '$ ns contact "how do I set up comment delimiters with escape chars?" -e pauljones123@gmail.com',
    '$ ns contact "generate is breaking when I add handlers."',
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

    try {
      await sendRequest(
        'Message', 'Sent from contact', message, email
      )
      // this.log(`result = ${JSON.stringify(result)}`)
    } catch (error) {
      this.error(`there was a problem sending your message: ${error}`)
    }

    this.log('Message has been sent.  We should see the message during our next business day.' +
      `  Meanwhile, please check out our documentation: ${links.DOCUMENTATION}.`)
  }
}
