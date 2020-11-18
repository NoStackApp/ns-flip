import {TemplateRequirements} from './TemplateRequirements'
import {newTemplateTasks} from './new/newTemplateTasks'

export async function generateTemplateFiles(requirements: TemplateRequirements) {
  const templateTasksList = await newTemplateTasks(requirements)
  await templateTasksList.run()
}
