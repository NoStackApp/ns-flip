'use strict'
import {Configuration} from '../../../shared/constants/types/configuration'
import {AnswersForPackages, DependencyChoiceList, DependencyList, DependencySet} from './dependencyTypes'

const chalk = require('chalk')
const inquirer = require('inquirer')

function createChoicesFromDepList(codeDependencies: DependencyList) {
  let dependencyChoices: DependencyChoiceList = []
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

function createSetupDependencyList(
  codeDependencies: DependencyList,
  answersPackageList: any,
  installationList: string[],
) {
  const packagesToInstall = Object.keys(codeDependencies).filter((n: string) =>
    !answersPackageList.includes(n))
  packagesToInstall.map((packageName: string) => {
    const fullPackageName = packageName + '@' + codeDependencies[packageName]
    if (!installationList.includes(fullPackageName))
      installationList.push(fullPackageName)
  })
  return installationList
}

export async function setupDependencies(suggestedDependencies: DependencySet, config: Configuration) {
  const {codeDependencies, codeDevDependencies} = suggestedDependencies
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

    const versioningOptions = {
      USE: 'Use versions',
      GET_LATEST: 'Get latest',
    }

    questions.push({
      type: 'list',
      name: 'useVersions',
      message: 'Do you want to specify the versions used in your sample' +
        ' or just get the latest? You can always go into your template config file and ' +
        ' modify them.',
      choices: [versioningOptions.USE, versioningOptions.GET_LATEST],
      when: function (answers: AnswersForPackages) {
        const mainDependenciesToAdd =
          answers.mainPackages.length !== dependencyChoices.length
        const devDependenciesToAdd =
          answers.devPackages.length !== devDependencyChoices.length
        return (mainDependenciesToAdd || devDependenciesToAdd)
      },
    })

    try {
      const answers: AnswersForPackages = await inquirer.prompt(questions)

      if (answers.useVersions) {
        const {setupSequence} = config
        if (!setupSequence.mainInstallation)
          setupSequence.mainInstallation = []
        if (!setupSequence.devInstallation)
          setupSequence.devInstallation = []

        if (answers.useVersions === versioningOptions.USE) {
          createSetupDependencyList(
            codeDependencies,
            answers.mainPackages,
            setupSequence.mainInstallation
          )
          createSetupDependencyList(
            codeDevDependencies,
            answers.devPackages,
            setupSequence.devInstallation
          )
        }
        config.setupSequence = setupSequence
      }
    } catch (error) {
      throw new Error(`problem getting answers from user about setup creation: ${error}`)
    }
  }
}
