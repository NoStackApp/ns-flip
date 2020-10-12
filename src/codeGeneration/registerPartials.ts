const path = require('path')
const Handlebars = require('handlebars')
const fs = require('fs-extra')

function registerPartial(path: string, name: string) {
  // Require partial
  const template = require(path)

  // Register partial
  Handlebars.registerPartial(name, template)
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
      registerPartial(filePath, partialName)
    }
  },
  ))
}
