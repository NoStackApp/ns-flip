import {expandNsAbbreviations} from './expandNsbbreviations'

const fs = require('fs-extra')
const Handlebars = require('handlebars')

Handlebars.registerHelper('curly', function (object: any, open: any) {
  return open ? '{' : '}'
})

Handlebars.registerHelper('safe', function (text: string) {
  return new Handlebars.SafeString(text)
})

// Handlebars.registerHelper('start', function (this: any, sectionName: any) {
//   console.log(`is this===sectionName? ${this === sectionName}`)
//   return new Handlebars.SafeString(`// ns__start_section ${sectionName.fileInfo}, loc: ${sectionName}`)
// })

Handlebars.registerHelper('nsFile', function (general: any) {
  return new Handlebars.SafeString(`/* ns__file  ${general.fileInfo} */`)
})

Handlebars.registerHelper('start', function (locationName: string) {
  return new Handlebars.SafeString(`/* ns__start_section ${locationName} */`)
})

Handlebars.registerHelper('end', function (locationName: string) {
  return new Handlebars.SafeString(`/* ns__end_section ${locationName} */`)
})

Handlebars.registerHelper('custom', function (locationName: string) {
  return new Handlebars.SafeString(`/* ns__custom_start ${locationName} *//* ns__custom_end ${locationName} */`)
})

Handlebars.registerHelper('customStart', function (locationName: string) {
  return new Handlebars.SafeString(`/* ns__custom_start ${locationName} */`)
})

Handlebars.registerHelper('customEnd', function (locationName: string) {
  return new Handlebars.SafeString(`/* ns__custom_end ${locationName} */`)
})

export async function loadFileTemplate(path: string) {
  let template = ''

  try {
    template = await fs.readFile(path, 'utf-8')
    template = expandNsAbbreviations(template)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw new Error(`error finding the file ${path}.
It may be that the template location is faulty, or that the template is not
correctly specified:
${error}`)
  }

  return Handlebars.compile(template)
}
