import {installDevPackagesTaskList} from './setup/installDevPackagesTaskList'
import {docPages, magicStrings, suffixes} from '../../shared/constants'
import {CommandSpec, Configuration} from '../../shared/constants/types/configuration'
import {getConfiguration} from '../../shared/getConfiguration'
import {getCodeInfo} from '../../shared/getCodeInfo'
import {CustomCodeRepository} from '../../shared/constants/types/custom'
import {dirOptions} from '../../shared/dirOptions'
import {createNewCode} from './createNewCode'
import {installMainPackagesTaskList} from './setup/installMainPackagesTaskList'
import {preCommandsTaskList} from './setup/preCommandsTaskList'
import {convertCommandArgs} from './setup/convertCommandArgs'

const execa = require('execa')
const fs = require('fs-extra')
const Listr = require('listr')
const yaml = require('js-yaml')

async function checkFolder(starterDir: string) {
  if (await fs.pathExists(starterDir)) {
    try {
      await fs.remove(starterDir)
    } catch (error) {
      throw new Error(`cannot remove the starter ${starterDir}: ${error}`)
    }
  }
}

async function spawnInteractiveChildProcess(commandSpec: CommandSpec) {
  await execa(
    commandSpec.file,
    commandSpec.arguments,
    commandSpec.options,
  ).catch(
    (error: any) => {
      throw new Error(`error with executing ${commandSpec.file}: ${error}`)
    },
  )
}

async function interactiveSequence(commandSpecs: CommandSpec[], codeDir: string) {
  let i
  for (i = 0; i < commandSpecs.length; i++) {
    const commandSpec = {...commandSpecs[i]}
    if (!commandSpec) {
      continue
    }

    commandSpec.arguments = convertCommandArgs(commandSpec.arguments, codeDir)

    if (!commandSpec.options) commandSpec.options = {}
    commandSpec.options.stdio = 'inherit'
    await spawnInteractiveChildProcess(commandSpec)
  }
}

export async function createStarter(
  templateDir: string,
  codeDir: string
) {
  const starterDir = codeDir + suffixes.STARTUP_DIR
  const config: Configuration = await getConfiguration(templateDir)
  const {setupSequence} = config
  if (!setupSequence) throw new Error('\'generate\' cannot run because ' +
    '\'setupSequence\' is undefined in the config of the template.' +
    ` See ${magicStrings.DOCUMENTATION}/${docPages.SETUP}.`)

  const {mainInstallation, devInstallation, preCommands, interactive} = setupSequence

  await checkFolder(starterDir)
  if (interactive) await interactiveSequence(interactive, starterDir)

  const starterCreationTaskList = [
    {
      title: 'Execute Pre-Commands',
      task: async () => {
        if (!preCommands) return
        return new Listr(preCommandsTaskList(preCommands, starterDir))
      },
    },
    {
      title: 'Install General Packages...',
      task: async () => {
        if (!mainInstallation) return
        return new Listr(installMainPackagesTaskList(mainInstallation, starterDir))
      },
    },
    {
      title: 'Install Dev Packages...',
      task: async () => {
        if (!devInstallation) return
        return new Listr(installDevPackagesTaskList(devInstallation, starterDir))
      },
    },
    {
      title: 'Add Meta-Data',
      task:
  async () => {
    const metaDir = `${starterDir}/${magicStrings.META_DIR}`
    const nsYml = `${metaDir}/${magicStrings.NS_FILE}`
    const customCode = `${metaDir}/${magicStrings.CUSTOM_CODE_FILE}`

    const appInfo = await getCodeInfo(`${templateDir}/sample.${magicStrings.NS_FILE}`)
    if (appInfo) appInfo.starter = starterDir

    // ensure nsYml if possible
    // let appInfo = await getCodeInfo(nsYml)
    // if (!appInfo) {
    //   appInfo = await getCodeInfo(`${templateDir}/sample.${magicStrings.NS_FILE}`)
    //   if (appInfo)
    //     await fs.outputFile(nsYml, yaml.safeDump(appInfo))
    // }

    const customDir = `${starterDir}/${config.dirs.custom}`
    const customCodeRepository: CustomCodeRepository = {
      addedCode: {},
      replacedCode: {},
      removedCode: {},
    }

    try {
      await fs.ensureDir(metaDir, dirOptions)
      await fs.ensureDir(customDir, dirOptions)
      if (appInfo) await fs.outputFile(nsYml, yaml.safeDump(appInfo))
      await fs.outputJson(customCode, customCodeRepository)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  },
    },
  ]

  const setup = new Listr(starterCreationTaskList)
  try {
    await setup.run()
    if (!await fs.pathExists(codeDir)) {
      const newAppTasks = await createNewCode(codeDir, starterDir)// , finalTemplateDir)
      await newAppTasks.run()
    }
  } catch (error) {
    throw new Error(`cannot create sample app at ${codeDir}: ${error}`)
  }
}
