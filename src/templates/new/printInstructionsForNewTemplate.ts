import {links, suffixes} from '../../shared/constants'
import {attention, generalOption} from '../../shared/constants/chalkColors'

export function printInstructionsForNewTemplate(templateDir: string) {
  return `Your template has been created at ${templateDir}. ` +
    attention(`See documentation at ${links.DOCUMENTATION}`) +
    `
You may want to paste the following lines into your terminal
to set the variables used in help and documentation examples:

TEMPLATE=${templateDir}
MODEL=${templateDir}${suffixes.MODEL_DIR}
CODE=${templateDir}${suffixes.SAMPLE_DIR}

` +
    'You can now call ' + generalOption('ns filediffs $TEMPLATE') +
    ' to be guided through the next steps for creating a complete template.'
}
