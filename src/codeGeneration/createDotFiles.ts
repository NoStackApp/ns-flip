import {boilerplateDir} from '../constants'

const fs = require('fs-extra')
const jsonfile = require('jsonfile')

export async function createDotFiles(
  appDir: string,
) {
  // .eslintrc file
  await fs.copy(
    `${boilerplateDir}/dotFiles/.eslintignore`,
    `${appDir}/.eslintignore`,
  )
  await fs.copy(
    `${boilerplateDir}/dotFiles/.eslintrc`,
    `${appDir}/.eslintrc`,
  )
  await fs.copy(
    `${boilerplateDir}/dotFiles/.prettierrc`,
    `${appDir}/.prettierrc`,
  )

  // update json.file with husky
  const generatedJsonFile = `${appDir}/package.json`
  const husky = {
    hooks: {
      'pre-commit': 'lint-staged',
    },
  }

  const lintStaged = {
    'src/**/*.{js,jsx}': [
      'eslint',
      'pretty-quick — staged',
      'git add',
    ],
  }

  jsonfile.readFile(generatedJsonFile, async function (err: any, obj: any) {
    // eslint-disable-next-line no-console
    if (err) console.error(err)
    obj.husky = husky
    obj['lint-staged'] = lintStaged
    await jsonfile.writeFile(generatedJsonFile, obj, {spaces: 2}, function (err: any) {
      // eslint-disable-next-line no-console
      if (err) console.error(err)
    })
  })
}
