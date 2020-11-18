'use strict'
import {getDependencies} from './getDependencies'
// import {removeNpmDependencyPrefix} from '../../shared/removeNpmDependencyPrefix'
import {Configuration} from '../../constants/types/configuration'

const chalk = require('chalk')
const inquirer = require('inquirer')

function createChoicesFromDepList(codeDependencies: any) {
  let dependencyChoices: any = []
  if (codeDependencies) {
    const packages = Object.keys(codeDependencies)
    dependencyChoices = packages.map((packageName: string) => {
      return {
        name: packageName,
      }
    })
  }
  return dependencyChoices
}

export async function setupCreation(sampleDir: string, config: Configuration) {
  const {codeDependencies, codeDevDependencies} = await getDependencies(sampleDir)
  const dependencyChoices: any = createChoicesFromDepList(codeDependencies)
  const devDependencyChoices: any = createChoicesFromDepList(codeDevDependencies)

  const questions = []
  if (dependencyChoices.length > 0) {
    questions.push({
      type: 'checkbox',
      loop: false,
      message: 'Following is a list of ' +
          chalk.green('packages') +
          ' in your sample app.' +
          '  Select from them the ones ' +
          chalk.red('*not*') +
          ' to generate (anything that was added for the business' +
          ' logic of your current sample). If you\'re not sure, don\'t check something!',
      name: 'mainPackages',
      choices: dependencyChoices,
    },
    )
  }

  if (devDependencyChoices.length > 0) {
    questions.push({
      type: 'checkbox',
      loop: false,
      message: 'Following is a list of ' +
          chalk.green('dev packages') +
          ' in your sample app.' +
          '  Select from them the ones ' +
          chalk.red('*not*') +
          ' to generate (anything that was added for the business' +
          ' logic of your current sample). If you\'re not sure, don\'t check something!',
      name: 'devPackages',
      choices: devDependencyChoices,
    })

    questions.push({
      type: 'list',
      name: 'useVersions',
      message: 'Do you want to specify the versions used in your sample' +
        ' or just get the latest? You can always go into your template config file and ' +
        ' modify them.',
      choices: ['Use versions', 'Get latest'],
      when: function (answers: any) {
        const mainDependenciesToAdd =
          answers.mainPackages.length !== dependencyChoices.length
        const devDependenciesToAdd =
          answers.devPackages.length !== devDependencyChoices.length
        return (mainDependenciesToAdd || devDependenciesToAdd)
      },
    }
    )

    // console.log(`dependencyChoices=${JSON.stringify(dependencyChoices, null, 2)}`)
    inquirer
    .prompt(questions)
    .then((answers: any) => {
      console.log(JSON.stringify(answers, null, '  '))
    }
    )
  }
}
