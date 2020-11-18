import {boilerplateDir} from '../../shared/constants'

const fs = require('fs-extra')
const jsonfile = require('jsonfile')

export async function createDotFiles(
  codeDir: string,
) {
  // .eslintrc file
  await fs.copy(
    `${boilerplateDir}/dotFiles/.eslintignore`,
    `${codeDir}/.eslintignore`,
  )
  await fs.copy(
    `${boilerplateDir}/dotFiles/.eslintrc`,
    `${codeDir}/.eslintrc`,
  )
  await fs.copy(
    `${boilerplateDir}/dotFiles/.prettierrc`,
    `${codeDir}/.prettierrc`,
  )

  // update json.file with husky
  const generatedJsonFile = `${codeDir}/package.json`
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
