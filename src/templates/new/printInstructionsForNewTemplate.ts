import {links, suffixes} from '../../shared/constants'
import * as chalk from 'chalk'

export function printInstructionsForNewTemplate(templateDir: string) {
  return `Your template has been created at ${templateDir}.` +
    chalk.green(`See documentation at ${links.DOCUMENTATION}`) +
    `
You may want to paste the following lines into your terminal
to set the variables used in help and documentation examples:

TEMPLATE=${templateDir}
MODEL=${templateDir}${suffixes.MODEL_DIR}
CODE=${templateDir}${suffixes.SAMPLE_DIR}

` +
    'You can call \'ns filediffs $TEMPLATE\' to be guided through ' +
    'the next steps for creating a complete template.'
}
