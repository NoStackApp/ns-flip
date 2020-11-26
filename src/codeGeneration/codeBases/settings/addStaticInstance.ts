import {Configuration} from '../../../shared/constants/types/configuration'
import {NsInfo} from '../../../shared/constants/types/nsInfo'
import {setNsInfo} from '../../../shared/nsFiles/setNsInfo'

const inquirer = require('inquirer')

export async function addStaticInstance(
  staticType: string,
  config: Configuration,
  nsInfo: NsInfo,
  codeDir: string,
) {
  // console.log(`** about to addStaticInstance for ${staticType}`)
  // const typeSpec = config.static[staticType].specs

  const addInstanceQuestions = [
    {
      type: 'input',
      name: 'name',
      message: `What is the name of the new ${staticType}?`,
    },
    {
      type: 'input',
      name: 'slug',
      message: "What's the slug?  (It will get inserted into things like file names.)",
    },
  ]

  const answers = await inquirer.prompt(addInstanceQuestions)

  if (nsInfo.static) {
    if (!nsInfo.static[staticType]) nsInfo.static[staticType] = {}

    nsInfo.static[staticType][answers.name] = {
      slug: answers.slug,
      specs: {},
    }
  } else {
    nsInfo.static = {
      [staticType]: {
        [answers.name]: {
          slug: answers.slug,
          specs: {},
        },
      },
    }
  }

  await setNsInfo(codeDir, nsInfo)

  // console.log(`** added answers = ${JSON.stringify(answers, null, 1)}`)
}
