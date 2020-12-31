import {pluralName, singularName} from '../../../shared/inflections'
import {ComponentTypeSpec} from '../../../shared/constants/types/configuration'

export const componentName = (type: string,
  componentTypeSpec: ComponentTypeSpec) => {
  const {singular} = componentTypeSpec

  let fullName: string
  if (singular) fullName = singularName(type)
  else fullName = pluralName(type)

  if (componentTypeSpec.prefix)
    fullName = componentTypeSpec.prefix + fullName
  if (componentTypeSpec.suffix)
    fullName = `${fullName}${componentTypeSpec.suffix}`

  return fullName
}
