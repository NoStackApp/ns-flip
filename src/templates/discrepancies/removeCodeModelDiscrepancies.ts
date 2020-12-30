import {magicStrings, suffixes} from '../../shared/constants'
import {Configuration} from '../../shared/constants/types/configuration'
import {getConfig} from '../../shared/configs/getConfig'
import {handleNewFiles} from '../new/files/handleNewFiles'
import {compareSync, Result} from 'dir-compare'
import * as chalk from 'chalk'
import {getIgnoredList} from '../../shared/configs/getIgnoredList'

async function getDiscrepantFiles(config: Configuration, codeDir: string, modelDir: string) {
  const allIgnored = getIgnoredList(config).map(dir => {
    if (dir.includes('/')) return '/' + dir
    return dir
  })
  let excludeFilter = allIgnored.join(',')
  if (excludeFilter.length > 0) excludeFilter += ','
  excludeFilter += magicStrings.DEFAULT_EXCLUDED_FOLDERS

  const res: Result = compareSync(codeDir, modelDir, {
    excludeFilter,
    compareContent: true,
  })
  return res
}

function displayUniqueOldFiles(res: Result) {
  if (!res || !res.diffSet) return
  const modifiedFileInfo = res.diffSet.filter((file: any) => (file.state === 'distinct'))
  const modifiedFiles = modifiedFileInfo.map((file: any) => {
    return file.relativePath.substring(1) + '/' + file.name1
  })

  if (modifiedFiles.length === 0) {
    // eslint-disable-next-line no-console
    console.log(chalk.red('No modified files.'))
    return
  }

  // eslint-disable-next-line no-console
  console.log(chalk.red('Modified files:'))
  // eslint-disable-next-line no-console
  modifiedFiles.map(fileName => console.log(`\t${fileName}`))
}

function displayUniqueNewFiles(res: Result) {
  if (!res || !res.diffSet) return
  const nonGeneratedFileInfo = res.diffSet.filter((file: any) => (file.type1 === 'missing'))
  const nonGeneratedFiles = nonGeneratedFileInfo.map((file: any) => {
    return file.relativePath.substring(1) + '/' + file.name2
  })

  if (nonGeneratedFiles.length === 0) {
    // eslint-disable-next-line no-console
    console.log(chalk.red('No files in the model code are not being generated.'))
    return
  }

  // eslint-disable-next-line no-console
  console.log(chalk.red('Files in the model code not being generated:'))
  // eslint-disable-next-line no-console
  nonGeneratedFiles.map(fileName => console.log(`\t${fileName}`))
}

export async function removeCodeModelDiscrepancies(templateDir: string, code: string, model: string) {
  const finalCode = code || templateDir + suffixes.SAMPLE_DIR
  const finalModel = model || templateDir + suffixes.MODEL_DIR

  const config: Configuration = await getConfig(templateDir)
  const res = await getDiscrepantFiles(config, finalCode, finalModel)

  await handleNewFiles(res, templateDir, finalCode, finalModel)

  if (res.diffSet) {
    displayUniqueNewFiles(res)
  }

  if (res.diffSet) {
    displayUniqueOldFiles(res)
  }
}
