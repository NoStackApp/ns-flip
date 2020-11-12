import {Configuration} from '../../constants/types/configuration'

const fs = require('fs-extra')

import {NsInfo} from '../../constants/types/nsInfo'
import {allCaps} from '../../shared/inflections'
import {loadFileTemplate} from '../../shared/loadFileTemplate'
import {parseSpecName} from '../../constants/parseSpecName'
import {unitNameFromSpec} from './unitNameFromSpec'
import {magicStrings} from '../../constants'

export async function dynamicFiles(config: Configuration, nsInfo: NsInfo, appDir: string) {
  if (!nsInfo.backend ||
    !nsInfo.backend.queries ||
    !config.dirs.queries
  ) return

  // create query files in the directory specified by the template.
  const {units, backend} = nsInfo
  if (!units) return

  // const templateDir = template.dir
  const queriesDir = `${appDir}/${config.dirs.queries}`

  // WARNING: breaking change from 1.6.8!!
  const metaDir = `${appDir}/${magicStrings.META_DIR}`
  const templateDir = `${metaDir}/${magicStrings.TEMPLATE}`

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

      const queryFile = `${queriesDir}/${unit}.js`
      try {
        await fs.outputFile(queryFile, queryFileText)
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
