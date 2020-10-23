import {checkDirForDiscrepancies} from '../testing/checkDirForDiscrepancies'
import {singularName} from '../shared/inflections'

export async function checkGeneratedUnits(
  units: string[],
  diffsDir: string,
  originalComps: string,
  generatedComps: string,
  logFile: string,
  problemsFound: boolean,
) {
  await Promise.all(units.map(async (unit: string) => {
    const unitName = singularName(unit)
    const diffsFile = `${diffsDir}/${unitName}`
    const originalUnit = `${originalComps}/${unitName}`
    const generatedUnit = `${generatedComps}/${unitName}`
    const problemsFoundLocally = await checkDirForDiscrepancies(
      diffsFile,
      originalUnit,
      generatedUnit,
      logFile,
      problemsFound
    )
    problemsFound = problemsFound || problemsFoundLocally
  }))
  return problemsFound
}
