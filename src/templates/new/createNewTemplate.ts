import {TemplateRequirements} from './TemplateRequirements'
import {newTemplateQuestions} from './newTemplateQuestions'
import {generateTemplateFiles} from './generateTemplateFiles'
import {getConfig} from '../../shared/configs/getConfig'
import {dirNames, suffixes} from '../../shared/constants'
import {getPreCommands} from './preCommands/getPreCommands'
import {executePreCommands} from './preCommands/executePreCommands'
import {copyCodeBaseToNewDir} from '../../codeGeneration/customCode/copyCodeBaseToNewDir'
import {setPackagesToSuggestInserting} from './dependencies/setPackagesToSuggestInserting'
import {setupDependencies} from './dependencies/setupDependencies'
import {setConfig} from '../../shared/configs/setConfig'
import {installDependencies} from './dependencies/installDependencies'
import {generateCode} from '../../codeGeneration/generateCode'
import {ensureDirectory} from '../../shared/ensureDirectory'
import {createCodeBase} from '../../codeGeneration/codeBases/createCodeBase'

const fs = require('fs-extra')

export async function createNewTemplate(model: string, defaultTemplateDir: string) {
  const defaults = {
    model,
    templateDir: defaultTemplateDir || '',
  }
  const responses: TemplateRequirements = await newTemplateQuestions(defaults)
  await generateTemplateFiles(responses)

  const {templateDir} = responses

  const config = await getConfig(templateDir)
  const codeDir = `${templateDir}${suffixes.SAMPLE_DIR}`
  const modelDir = `${templateDir}${suffixes.MODEL_DIR}` // model is the original.  modelDir is a copy

  const starterDir = codeDir + suffixes.STARTUP_DIR
  // await getPreCommands(config)
  // await executePreCommands(config, starterDir, {codeDir})
  fs.ensureDir(starterDir) // if no preCommands created the starterDir, we do so now.

  await copyCodeBaseToNewDir(model, modelDir)

  const suggestedDependencies = await setPackagesToSuggestInserting(starterDir, modelDir)
  if (suggestedDependencies) await setupDependencies(suggestedDependencies, config)
  await setConfig(templateDir, config)

  // await installDependencies(config, starterDir)
  // await setConfig(templateDir, config)

  await createCodeBase(templateDir, codeDir, false)

  return templateDir
}
