import {docPages, links, magicStrings} from '../../shared/constants'

import {regenerateCode} from '../regenerateCode'
import {copyTemplateToMeta} from './copyTemplateToMeta'
import {createStarter} from './createStarter'

const fs = require('fs-extra')

export async function createCodeBase(
  // starterDir: string,
  templateDir: string | undefined,
  codeDir: string,
  noSetup: boolean
) {
  const codeMetaDir = `${codeDir}/${magicStrings.META_DIR}`
  const codeTemplateDir = `${codeMetaDir}/${magicStrings.TEMPLATE}`
  const existsCodeTemplateDir = await fs.pathExists(codeTemplateDir)

  if (!templateDir && noSetup) {
    throw new Error('the noSetup flag cannot be used unless a template is specified.')
  }

  if (!templateDir && !existsCodeTemplateDir) {
    if (!await fs.pathExists(codeDir)) {
      throw new Error('you called \'generate\' without specifying a template' +
        ` for a code base that does not yet exist (${codeDir}).  Please provide a template` +
        'with the \'-t\' flag to create the code base. ' +
        `See ${links.DOCUMENTATION}/${docPages.BUILDING_CODE_BASE}.`)
    }
    throw new Error('you called \'generate\' without specifying a template' +
      ' for a code base that does not have proper prior template info.  ' +
      'Please provide a template with the \'-t\' flag. ' +
      `See ${links.DOCUMENTATION}/${docPages.BUILDING_CODE_BASE}.`)
  }

  if (!templateDir && noSetup) {
    throw new Error('you called \'generate\' with the \'--noSetup\' flag without specifying ' +
      'a template.  Please either remove the \'--noSetup\' or provide a template ' +
      'with the \'-t\' flag. ' +
      `See ${links.DOCUMENTATION}/${docPages.BUILDING_CODE_BASE}.`)
  }

  if (templateDir && (!existsCodeTemplateDir || !noSetup)) {
    await createStarter(templateDir, codeDir)
  }

  if (templateDir) {
    await copyTemplateToMeta(codeTemplateDir, templateDir)
  }

  await regenerateCode(codeDir)

  /*
//  What follows is old

  const finalTemplateDir = templateDir || codeTemplateDir

  console.log(`templateDir: ${templateDir}`)
  console.log(`finalTemplateDir: ${finalTemplateDir}`)
  const generateCode =       {
    title: 'Generate Code',
    task: async () => {
      return new Listr([
        {
          title: 'Create Code if None Exists',
          task: async () => {
            const isSampleBaseAlready = await fs.pathExists(codeDir)

            if (!isSampleBaseAlready) {
              // if (!templateDir)
              //   throw new Error('you called \'generate\' without specifying a template' +
              //     ' for a code base that does not yet exist.  Please provide a template' +
              //     'with the \'-t\' flag. ' +
              //     `See ${links.DOCUMENTATION}/${docPages.BUILDING_CODE_BASE}.`)
              try {
                const newAppTasks = await createNewCode(codeDir, starterDir)// , finalTemplateDir)
                await newAppTasks.run()
              } catch (error) {
                throw new Error(`cannot create sample app at ${codeDir}: ${error}`)
              }
            }
          },
        },
        {
          title: 'Produce the Code',
          task: async () => {
            if (finalTemplateDir !== codeTemplateDir)
              console.log(`in "Produce the Code", codeTemplateDir=${codeTemplateDir}, finalTemplateDir=${finalTemplateDir}`)
            await copyTemplateToMeta(codeTemplateDir, finalTemplateDir)

            await fs.ensureFile(`${codeDir}/meta/ns.yml`)
            await regenerateCode(codeDir)
          },
        },
      ])
    },
  }

  const isStarterDir = await fs.pathExists(starterDir)

  if (!templateDir && isStarterDir) {
    // const isInstalledTemplate = await fs.pathExists(codeMetaDir + '/' + magicStrings.TEMPLATE)
    // if (!isStarterDir || !isInstalledTemplate) {
    //   throw new Error(`You must provide a template to create ${starterDir}.  Use -t.` +
    //   ` See ${links.DOCUMENTATION}/${docPages.BUILDING_CODE_BASE}.`)
    // }
    return new Listr([
      generateCode,
    ])
  }

  if (templateDir && noSetup) {
    const copyTemplate =     {
      title: 'Copy template to dir',
      task: async () => {
        const codeMetaDir = `${codeDir}/${magicStrings.META_DIR}`
        const codeTemplateDir = `${codeMetaDir}/${magicStrings.TEMPLATE}`
        await copyTemplateToMeta(codeTemplateDir, templateDir)
      },
    }

    return new Listr([
      copyTemplate,
      generateCode,
    ])
  }

  const config: Configuration = await getConfiguration(finalTemplateDir)
  const {setupSequence} = config
  if (!setupSequence) throw new Error('\'generate\' cannot run because ' +
    '\'setupSequence\' is undefined in the config of the template.' +
    ` See ${links.DOCUMENTATION}/${docPages.SETUP}.`)

  const {mainInstallation, devInstallation, preCommands, interactive} = setupSequence

  await checkFolder(starterDir)
  if (interactive) await interactiveSequence(interactive, starterDir)

  const taskList = [
    {
      title: 'Execute Pre-Commands',
      task: async () => {
        if (!preCommands) return
        return new Listr(preCommands.map((commandSpec: CommandSpec) => {
          return {
            title: commandSpec.title,
            task: async () => {
              await execa(
                commandSpec.file,
                convertCommandArgs(commandSpec.arguments, starterDir),
                commandSpec.options,
              ).catch(
                (error: any) => {
                  throw new Error(`${chalk.red(`error with pre-command ${commandSpec.title}.`)}
Here is the information about the command: ${JSON.stringify(commandSpec, null, 1)}
You may try contacting the author of your template to see what they suggest.
Here is the error reported:\n${error}`)
                },
              )
            },
          }
        },
        ))
      },
    },
    {
      title: 'Install General Packages...',
      task: async () => {
        if (!mainInstallation) return
        return new Listr(mainInstallation.map((item: string) => {
          return {
            title: item,
            task: async () => {
              await execa(
                'npm',
                ['install', '--prefix', starterDir, '--save', item],
              ).catch(
                (error: any) => {
                  throw new Error(`${chalk.red(`error installing ${item}.`)} You may try installing ${item} directly by running 'npm install --save ${item}' directly and see what messages are reported. Here is the error reported:\n${error}`)
                },
              )
            },
          }
        },
        ))
      },
    },
    {
      title: 'Install Dev Packages...',
      task: async () => {
        if (!devInstallation) return
        return new Listr(devInstallation.map((item: string) => {
          return {
            title: item,
            task: async () => {
              await execa(
                'npm',
                ['install', '--prefix', starterDir, '--save-dev', item],
              ).catch(
                (error: any) => {
                  throw new Error(`${chalk.red(`error installing ${item}.`)} You may try installing ${item} directly by running 'npm install --save ${item}' directly and see what messages are reported. Here is the error reported:\n${error}`)
                },
              )
            },
          }
        },
        ))
      },
    },
    {
      title: 'Add Meta-Data',
      task: async () => {
        const metaDir = `${starterDir}/${magicStrings.META_DIR}`
        const nsYml = `${metaDir}/${magicStrings.NS_FILE}`
        const customCode = `${metaDir}/${magicStrings.CUSTOM_CODE_FILE}`

        const appInfo = await getCodeInfo(`${finalTemplateDir}/sample.${magicStrings.NS_FILE}`)
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
    generateCode,
  ]

  return new Listr(taskList)
 // logProgress(`${chalk.green('Installation is complete!')} Run the other utilities to create the full app`)

   */
}
