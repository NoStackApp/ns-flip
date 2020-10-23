// const fs = require('fs-extra')
//
// import {AppInfo, StackInfo} from '../constants/types'
// import {allCaps} from '../shared/inflections'
// import {loadFileTemplate} from './loadFileTemplate'
//
// const Handlebars = require('handlebars')
//
// // import {sourcePropsDir} from './createTopProjectDirs'
//
// export async function createQueryFile(
//   unit: string,
//   sourcePropsDir: string,
//   appInfo: AppInfo,
//   template: string,
// ) {
//   if (!appInfo.backend ||
//     !appInfo.backend.queries ||
//     !appInfo.backend.queries[unit]
//   ) return
//
//   const unitInfo = appInfo.backend.queries[unit]
//   console.log(`sourceInfo=${JSON.stringify(unitInfo)}`)
//
//   // const sourceInfo = stackInfo.sources[source]
//
//   const queryFileText = queryFileTemplate({
//     sourceAllCaps: allCaps(unit),
//     queryBody: unitInfo.body,
//     typeRelationships: unitInfo.relationships,
//   })
//
//   const queryFile = `${sourcePropsDir}/${unit}.js`
//   try {
//     await fs.outputFile(queryFile, queryFileText)
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error(error)
//   }
// }
