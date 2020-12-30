import {expandNsAbbreviations} from './expandNsbbreviations'
import {placeholders} from '../shared/constants'

const fs = require('fs-extra')
const Handlebars = require('handlebars')

Handlebars.registerHelper('curly', function (object: any, open: any) {
  return open ? '{' : '}'
})

Handlebars.registerHelper('safe', function (text: string) {
  return new Handlebars.SafeString(text)
})

Handlebars.registerHelper('start', function (locationName: string) {
  return new Handlebars.SafeString(placeholders.OPEN_COMMENT +
    ` ns__start_section ${locationName} ` +
    placeholders.CLOSE_COMMENT
  )
})

Handlebars.registerHelper('end', function (locationName: string) {
  return new Handlebars.SafeString(
    placeholders.OPEN_COMMENT +
    ` ns__end_section ${locationName} ` +
    placeholders.CLOSE_COMMENT
  )
})

Handlebars.registerHelper('custom', function (locationName: string) {
  return new Handlebars.SafeString(
    placeholders.OPEN_COMMENT +
    ` ns__custom_start ${locationName} ` +
    placeholders.CLOSE_COMMENT + '\n' +
    placeholders.OPEN_COMMENT +
    ` ns__custom_end ${locationName} ` +
    placeholders.CLOSE_COMMENT
  )
})

Handlebars.registerHelper('customStart', function (locationName: string) {
  return new Handlebars.SafeString(
    placeholders.OPEN_COMMENT +
    ` ns__custom_start ${locationName} ` +
    placeholders.CLOSE_COMMENT
  )
})

Handlebars.registerHelper('customEnd', function (locationName: string) {
  return new Handlebars.SafeString(
    placeholders.OPEN_COMMENT +
    ` ns__custom_end ${locationName} ` +
    placeholders.CLOSE_COMMENT
  )
})

export async function loadFileTemplate(pathString: string, noFileInfo = false) {
  // noFileInfo suppresses generation of a file info tag at the beginning of the template.
  let template = ''

  try {
    template = await fs.readFile(pathString, 'utf-8')
    if (!noFileInfo) {
      template = '{{nsFile}}\n' + template // add file info automatically.
    }

    template = expandNsAbbreviations(template)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw new Error(`error finding the file ${pathString}.
It may be that the template location is faulty, or that the template is not
correctly specified:
${error}`)
  }

  return Handlebars.compile(template)
}
