import {Configuration} from '../../shared/constants/types/configuration'

const fs = require('fs-extra')

import {NsInfo} from '../../shared/constants/types/nsInfo'
import {allCaps} from '../../shared/inflections'
import {loadFileTemplate} from '../../templates/loadFileTemplate'
import {parseSpecName} from '../../shared/constants/parseSpecName'
import {unitNameFromSpec} from './unitNameFromSpec'
import {dirNames} from '../../shared/constants'
import {replaceCommentDelimiters} from './replaceCommentDelimiters'

export async function dynamicFiles(config: Configuration, nsInfo: NsInfo, codeDir: string) {
  if (!nsInfo.backend ||
    !nsInfo.backend.queries ||
    !config.dirs.queries
  ) return

  // create query files in the directory specified by the template.
  const {units, backend} = nsInfo
  if (!units) return

  // const templateDir = template.dir
  const queriesDir = `${codeDir}/${config.dirs.queries}`

  // WARNING: breaking change from 1.6.8!!
  const metaDir = `${codeDir}/${dirNames.META}`
  const templateDir = `${metaDir}/${dirNames.TEMPLATE}`

  const queryFileTemplate = await loadFileTemplate(`${templateDir}/query.hbs`)
  try {
    await Promise.all(Object.keys(units).map(async unitKey => {
      const unit = unitNameFromSpec(unitKey)
      const keyInQueries = parseSpecName(unitKey).name

      if (!backend ||
        !backend.queries ||
        !backend.queries[keyInQueries]) return

      const unitQueryInfo = backend.queries[keyInQueries]

      const queryFileText = queryFileTemplate({
        unitAllCaps: allCaps(unit),
        queryBody: unitQueryInfo.body,
        typeRelationships: unitQueryInfo.relationships,
      })

      const pathString = `${queriesDir}/${unit}.js`
      try {
        const finalFileText = replaceCommentDelimiters(pathString, config, queryFileText)
        // console.log(`finalFileText for ${pathString}=${finalFileText}`)
        await fs.outputFile(pathString, finalFileText)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }

      // await createQueryFile(unitNameInfo.name, queriesDir, appInfo, template)
    }))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw new Error('error in creating query file')
  }
}
