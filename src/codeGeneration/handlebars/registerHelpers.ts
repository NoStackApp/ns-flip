const path = require('path')
const Handlebars = require('handlebars')
const fs = require('fs-extra')

function registerHelper(path: string, name: string) {
  // Require helper
  const functionDef = require(path)[name]

  // Register helper
  Handlebars.registerHelper(name, functionDef)
}

export async function registerHelpers(dir: string) {
  // console.log(`about to list helpers in ${dir}`)
  if (!await fs.pathExists(dir)) return
  const helpers: [string] = await fs.readdir(dir)
  await Promise.all(helpers.map(async fileName => {
    const filePath = `${dir}/${fileName}`
    const fileType = path.parse(filePath).ext

    if (fs.lstatSync(filePath).isDirectory()) {
      await registerHelpers(filePath)
      return
    }

    if (fileType === '.ts') {
      const helperName = path.parse(filePath).name
      registerHelper(filePath, helperName)
    }
  },
  ))
}
