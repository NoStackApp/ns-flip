import {Configuration} from '../../../shared/constants/types/configuration'
import {installMainPackagesTaskList} from '../../../codeGeneration/codeBases/setup/installMainPackagesTaskList'
import {installDevPackagesTaskList} from '../../../codeGeneration/codeBases/setup/installDevPackagesTaskList'

const Listr = require('listr')

export async function installDependencies(config: Configuration, starterDir: string) {
  if (!config.setupSequence) return

  try {
    if (config.setupSequence.mainInstallation) {
      const mainListr = new Listr(installMainPackagesTaskList(
        config.setupSequence.mainInstallation,
        starterDir
      ))
      await mainListr.run()
    }

    if (config.setupSequence.devInstallation) {
      const devListr = new Listr(installDevPackagesTaskList(
        config.setupSequence.devInstallation,
        starterDir
      ))
      await devListr.run()
    }
  } catch (error) {
    throw new Error(`cannot load packages for ${starterDir}: ${error}`)
  }
}
