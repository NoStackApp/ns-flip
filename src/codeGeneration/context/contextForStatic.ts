import {Configuration} from '../../constants/types/configuration'
import {NsInfo} from '../../constants/types/nsInfo'
import {pluralLowercaseName, pluralName, singularName} from '../../shared/inflections'
import {createGeneralInfo} from './createGeneralInfo'

const Handlebars = require('handlebars')

const fileInfoString = Handlebars.compile('unit: {{unitName}}, comp: {{component}}')

export const contextForStatic = async (
  staticType: string,
  specs: any,
  slug: string,
  instance: string,
  fileName: string,
  nsInfo: NsInfo,
  config: Configuration,
  codeDir: string,
) => {
  const names = {
    singular: singularName(instance),
    singularLowercase: instance,
    plural: pluralName(instance),
    pluralLowercase: pluralLowercaseName(instance),
    staticType,
    component: fileName,
  }

  const fileInfo = fileInfoString({
    unitName: `static-${staticType}`,
    component: names.component,
  })

  const general = createGeneralInfo(nsInfo, codeDir)

  return {
    specs,
    slug,
    names,
    fileInfo,
    nsInfo,
    config,
    general,
  }
}
