const fs = require('fs-extra')
const Handlebars = require('handlebars')

Handlebars.registerHelper('curly', function (object: any, open: any) {
  return open ? '{' : '}'
})

Handlebars.registerHelper('safe', function (text: string) {
  return new Handlebars.SafeString(text)
})

export async function loadFileTemplate(path: string) {
  let template = ''
  try {
    template = await fs.readFile(path, 'utf-8') // require('../sections/generic.hbs')
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
