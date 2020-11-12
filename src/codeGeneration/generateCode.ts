import {magicStrings} from '../constants'
import {NsInfo} from '../constants/types/nsInfo'
import {Schema} from '../constants/types/schema'
import {configuredDirs} from './fileGeneration/configuredDirs'
import {dynamicFiles} from './fileGeneration/dynamicFiles'
import {buildSchema} from './schema/buildSchema'
import {standardFiles} from './fileGeneration/standardFiles'
import {staticFiles} from './fileGeneration/staticFiles'
import {generateAppTypeFiles} from './fileGeneration/dynamicComponents/generateAppTypeFiles'
import {Configuration} from '../constants/types/configuration'

// const fs = require('fs-extra')

export async function generateCode(
  codeDir: string,
  nsInfo: NsInfo,
  config: Configuration,
  // jsonPath: string,
) {
  const {userClass, units, template, starter} = nsInfo
  if (!starter) throw new Error(`the '${magicStrings.NS_FILE}' file contains no starter.  ` +
    'You need a starter to generate code.')

  const stackInfo: Schema = await buildSchema(nsInfo, config)

  // console.log(`stacklocation=${appDir}/stack.json`)
  // const stackInfo: Schema = await fs.readJSON(jsonPath) // await generateJSON.bind(this)(template, appDir)

  const metaDir = `${codeDir}/${magicStrings.META_DIR}`
  const templateDir = `${metaDir}/${magicStrings.TEMPLATE}`

  try {
    // WARNING: breaking change from 1.6.8!!
    // await standardFiles(template.dir, codeDir, nsInfo, stackInfo)
    await standardFiles(templateDir, codeDir, nsInfo, stackInfo)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw new Error(`error in creating standard files: ${error}`)
  }

  // console.log(`units is: ${JSON.stringify(Object.keys(units), null, 2)}`)
  try {
    if (units) {
      await configuredDirs(config, codeDir, Object.keys(units))
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw new Error(`error in creating configured dirs: ${error}`)
  }

  // console.log(`appDir=${appDir}`)
  // const appName = appNameFromPath(appDir)
  // const configText = await createConfigFile(currentStack, appName, template)
  // console.log(`configText=${configText}`)
  // await fs.outputFile(`${srcDir}/config/index.js`, configText)

  // try {
  //   await createHighestLevelFiles(currentStack, appDir, userClass, appName)
  // } catch (error) {
  //   throw new Error(`error in creating highest level files: ${error}`)
  // }

  // mapObject
  if (units) {
    await dynamicFiles(config, nsInfo, codeDir)
  }
  // if (config.dirs.queries) {
  //   // create query files in the directory specified by the template.
  //   const queriesDir = config.dirs.queries
  //   try {
  //     console.log(`before units: ${JSON.stringify(Object.keys(units), null, 2)}`)
  //     await Promise.all(Object.keys(units).map(async unit => {
  //       console.log(`creating query file for unit ${unit}`)
  //       const unitNameInfo = parseUnitSpecName(unit)
  //       await createQueryFile(unitNameInfo.name, queriesDir, appInfo, template)
  //     }))
  //   } catch (error) {
  //     console.error(error)
  //     throw new Error('error in creating query file')
  //   }
  // }

  const compDir = `${codeDir}/${config.dirs.components}`

  try {
    await generateAppTypeFiles(
      userClass,
      nsInfo,
      stackInfo,
      templateDir,
      compDir,
      config
    )
  } catch (error) {
    throw error
  }

  try {
    await staticFiles(
      templateDir,
      codeDir,
      nsInfo,
      stackInfo,
      config,
    )
  } catch (error) {
    throw error
  }

  // // '--end-of-line auto',
  // // '--trailing-comma es5',
  // const prettierArgs = [
  //   'prettier',
  //   '--single-quote',
  //   '--jsx-single-quote',
  //   // '--trailing-comma es5',
  //   '--write',
  //   `${appDir}/src/**/*.{js,jsx}`,
  // ]
  //
  // try {
  //   await execa('npx', prettierArgs)
  // } catch (error) {
  //   throw error
  // }
}
