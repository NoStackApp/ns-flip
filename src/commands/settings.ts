import {Command, flags} from '@oclif/command'
import {checkForUpdates} from '../shared/checkForUpdates'

const expandTilde = require('expand-tilde')

export default class Filediffs extends Command {
  static description = 'create new template.'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'codeDir',
      required: true,
      description: 'directory containing the code',
      hidden: false,
    },

  ]

  static examples = [
    '$ ns settings $CODE',
  ]

  async run() {
    checkForUpdates()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {flags, args} = this.parse(Filediffs)

    const templateDir = expandTilde(args.templateDir)

    try {
      const sample = '/home/yisroel/ns2/samples/ez-oclif-cli-code.sample'
      const code = '/home/yisroel/ns2/samples/ez-oclif-cli-code'

      const config = await getConfig(templateDir)
      const allIgnored = getIgnoredList(config).map(dir => {
        if (dir.includes('/')) return '/' + dir
        return dir
      })
      let excludeFilter = allIgnored.join(',')
      if (excludeFilter.length > 0) excludeFilter += ','
      excludeFilter += 'node_modules,lib,.idea'

      const res: Result = compareSync(code, sample, {
        excludeFilter,
        compareContent: true,
      })

      await handleNewFiles(res, templateDir, code, sample)

      // console.log(`res = ${JSON.stringify(res, null, 2)}`)
      if (res.diffSet) {
        const nonGeneratedFileInfo = res.diffSet.filter((file: any) => (file.type1 === 'missing'))
        const nonGeneratedFiles = nonGeneratedFileInfo.map((file: any) => {
          return  file.relativePath.substring(1) + '/' + file.name2
          // filePath.replace(/\/\//g, '/')
        })
        this.log(chalk.red('files not being generated:'))
        nonGeneratedFiles.map(fileName => this.log(`\t${fileName}`))
      }

      // console.log(`res = ${JSON.stringify(res, null, 2)}`)
      if (res.diffSet) {
        const modifiedFileInfo = res.diffSet.filter((file: any) => (file.state === 'distinct'))
        const modifiedFiles = modifiedFileInfo.map((file: any) => {
          return file.relativePath.substring(1) + '/' + file.name1
        })
        this.log(chalk.red('modified files:'))
        modifiedFiles.map(fileName => this.log(`\t${fileName}`))
      }

      this.log(chalk.greenBright(`See ${magicStrings.DOCUMENTATION}Add-Files-For-Customization` +
      ' for how to remove these discrepancies.'))
    } catch (error) {
      this.log(error)
      this.error(`cannot compare directories: ${error}`)
    }
  }
}
