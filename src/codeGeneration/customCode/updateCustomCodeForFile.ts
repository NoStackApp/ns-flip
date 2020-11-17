import {FileCustomCode} from '../../constants/types/custom'
import {
  regExReplacedCodeSectionGenerated,
  regExReplacedCodeSectionTagged,
} from '../../constants/Regex/regExReplacedCodeSection'
import {customLocationNewRegExString} from '../../constants/Regex/regExNewCustomLocation'
import {regExCleanupText} from '../../constants/Regex/regExCleanupText'
import {customCleanupRegExText} from '../../constants/Regex/regExCustomCleanup'
import {commentDelimiters} from '../../templates/commentDelimiters'
import {Configuration} from '../../constants/types/configuration'

export const fs = require('fs-extra')
const path = require('path')

export async function updateCustomCodeForFile(
  filePath: string,
  fileCustomCode: FileCustomCode,
  config: Configuration
) {
  let fileText: string

  try {
    fileText = await fs.readFile(filePath, 'utf-8')
  } catch (error) {
    throw new Error(`couldn't read the file ${filePath}`)
  }

  const {addedCode, replacedCode} = fileCustomCode

  const ext = path.extname(filePath)
  const delimiters = commentDelimiters(ext, config)

  const regExNewCustomLocation = new RegExp(customLocationNewRegExString(delimiters), 'g')

  fileText = fileText.replace(regExNewCustomLocation, function (
    match: string,
    location: string,
  ) {
    if (!addedCode[location]) return match // this shouldn't happen

    return delimiters.open + ' ns__custom_start ' + location + ' ' + delimiters.close +
      addedCode[location] +
      delimiters.open + ' ns__custom_end ' + location + ' ' + delimiters.close
  })

  /*
          REPLACED CODE:
          The generated search looks for starts of sections,
          and then sees whether they are replaced.
          If so, changes start delimiter.

          NOTE: the reason for this step is that regex isn't handling embedded searches.
          Could be there's a way, but I haven't found it.  That is, if I have a section and a
          subsection, it will not see the subsection.  For instance, if section A contains
          a section A1, and A1 is replaced, just searching for sections will never find A1.
          Because once A is found, nothing in it will be searched further.

          So, I use this workaround: I look only for the starting delimiter.
          I check whether any such section is replaced.

          If it has been replaced, I tag it as such. I then search for the tagged
          "replacement" sections.
          This takes advantage of the fact that of course a section and a subsection within
          it cannot both be replaced.
       */
  //

  fileText = fileText.replace(regExReplacedCodeSectionGenerated(delimiters), function (
    match: string,
    location: string,
  ) {
    if (!replacedCode[location]) return match
    return match.replace('ns__start_section', 'ns__start_replacement')
  })

  fileText = fileText.replace(regExReplacedCodeSectionTagged(delimiters), function (
    match: string,
    location: string,
  ) {
    if (!replacedCode[location]) return match

    const fullReplacement =
      delimiters.open + ' ns__start_replacement ' + location + delimiters.close +
      replacedCode[location] +
      delimiters.open + ` ns__end_replacement ${location} ` + delimiters.close
    return fullReplacement
  })

  // clean up
  const regExCleanUp = new RegExp(regExCleanupText(delimiters), 'g')

  fileText = fileText.replace(regExCleanUp, function (
    match: string,
    prefix: string,
    type: string,
    p3: string,
    p4: string,
    location: string,
    endOfLine: string,
  ) {
    return `${delimiters.open} ns__${prefix}_${type} ${location}${endOfLine}`
  })

  const regExCustomCleanUp = new RegExp(customCleanupRegExText, 'g')

  fileText = fileText.replace(regExCustomCleanUp, function (
    match: string,
    prefix: string,
    p3: string,
    p4: string,
    location: string,
    endOfLine: string,
  ) {
    return `${delimiters.open} ns__custom_${prefix} ${location}${endOfLine}`
  })

  try {
    await fs.outputFile(filePath, fileText)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
