import {expandNsAbbreviations} from '../../templates/expandNsbbreviations'

const path = require('path')
const Handlebars = require('handlebars')
const fs = require('fs-extra')

async function registerPartial(path: string, name: string) {
  let templateString = ''
  try {
    templateString = await fs.readFile(path, 'utf-8')
  } catch (error) {
    throw new Error(`couldn't read the partial file '${path}'`)
  }

  templateString = expandNsAbbreviations(templateString)
  Handlebars.registerPartial(name, templateString)
}

export async function registerPartials(dir: string) {
  // console.log(`about to list partials in ${dir}`)
  const partials: [string] = await fs.readdir(dir)
  await Promise.all(partials.map(async fileName => {
    const filePath = `${dir}/${fileName}`
    const fileType = path.parse(filePath).ext

    if (fs.lstatSync(filePath).isDirectory()) {
      await registerPartials(filePath)
      return
    }

    if (fileType === '.hbs' || fileType === '.handlebars') {
      const partialName = path.parse(filePath).name
      await registerPartial(filePath, partialName)
    }
  },
  ))
}
