// import {TSError} from 'ts-node'
// import {fileURLToPath} from 'url'
import {BoilerPlateInfoType} from '../../constants'
import {NsInfo} from '../../constants/types/nsInfo'
import {Schema} from '../../constants/types/schema'
import {singularName} from '../../shared/inflections'
import {context} from '../context'
import {loadFileTemplate} from '../loadFileTemplate'
import {makeDirs} from '../makeDirs'
import {registerHelpers} from '../registerHelpers'
import {registerPartials} from '../registerPartials'
import {componentName} from './componentName'
import {Configuration} from '../../constants/types/configuration'
// import {generic} from '../sections/generic'

const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers')
const fs = require('fs-extra')
// const fetch = require('node-fetch')
// const Handlebars = require('handlebars')
// const boilerPlateFromInfo = (boilerPlateInfo: BoilerPlateInfoType) =>
//   boilerPlates[boilerPlateInfo.formType + boilerPlateInfo.dataType + boilerPlateInfo.nodeType]

H.registerHelpers(Handlebars)

export async function generateTypeFile(
  type: string,
  source: string,
  boilerPlateInfo: BoilerPlateInfoType,
  appInfo: NsInfo,
  currentStack: Schema,
  templateDir: string,
  compDir: string,
  config: Configuration,
) {
  const {componentTypes} = config
  if (!componentTypes) throw new Error('No component types found for the template.')
  const dir = componentName(type, componentTypes[boilerPlateInfo.componentType])
  // console.log(`dir=${dir}`)

  try {
    await registerPartials(`${templateDir}/partials`)
    await registerHelpers(`${templateDir}/helpers`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw new Error(`error registering the partials or helpers at ${templateDir}.
It may be that the template location is faulty, or that the template is not
correctly specified:
${error}`)
  }

  // console.log(`here's a list of helpers: ${JSON.stringify(Handlebars.helpers, null, 2)}`)
  const genericTemplate = await loadFileTemplate(`${templateDir}/generic.hbs`)

  const path = `${compDir}/${singularName(source)}/${dir}`
  const dirList = [
    path,
  ]

  const tags = await context(
    type,
    source,
    appInfo,
    currentStack,
    boilerPlateInfo,
    config,
  )
  // console.log(`tags.context.formTypes.LIST=${JSON.stringify(tags.context.formTypes.LIST)}`)
  // console.log(`tags.context.boilerPlateInfo.formType=${JSON.stringify(tags.context.boilerPlateInfo.formType)}`)

  // if (boilerPlate === 'genericCreationFormRoot') {
  //   console.log(`tags = ${JSON.stringify(tags, null, 2)}`)
  // }
  // console.log(`options is: ${JSON.stringify(options)}`)
  await makeDirs(dirList)

  // const unitTemplate = 'https://raw.githubusercontent.com/YizYah/basicNsFrontTemplate/master/generic.txt'
  // let specificFileTemplate = function (tags: any) {
  //   // eslint-disable-next-line no-console
  //   console.error(`template not fetched.  This could be due to a uri error
  //   tags = ${JSON.stringify(tags)}`)
  //   throw new Error('template not fetched.  This could be due to a uri error')
  // }
  try {
    // await fetch(unitTemplate)
    // .then((res: any) => res.text())
    // .then((body: any) => {
    //   specificFileTemplate = Handlebars.compile(body)
    // })

    // await fs.outputFile(`${path}/index.jsx`, specificFileTemplate(tags))
    // console.log(`  path to output=${path}/index.jsx`)
    await fs.outputFile(`${path}/index.jsx`, genericTemplate(tags))
  } catch (error) {
    throw new Error(`error with generateFromBoilerPlate: ${error}`)
  }
}
