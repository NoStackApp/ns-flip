import {Configuration} from '../constants/types/configuration'

const fs = require('fs-extra')

import {NsInfo} from '../constants/types/nsInfo'
import {allCaps} from '../shared/inflections'
import {loadFileTemplate} from './loadFileTemplate'
import {parseSpecName} from '../constants/parseSpecName'
import {unitNameFromSpec} from './unitNameFromSpec'

export async function createQueryFiles(config: Configuration, appInfo: NsInfo, appDir: string) {
  if (!appInfo.backend ||
    !appInfo.backend.queries ||
    !config.dirs.queries
  ) return

  // create query files in the directory specified by the template.
  const {units, template, backend} = appInfo
  const templateDir = template.dir
  const queriesDir = `${appDir}/${config.dirs.queries}`

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
