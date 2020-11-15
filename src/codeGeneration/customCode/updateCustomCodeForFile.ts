import {FileCustomCode} from '../../constants/types/custom'
import {
  regExReplacedCodeSectionGenerated,
  regExReplacedCodeSectionTagged,
} from '../../constants/Regex/regExReplacedCodeSection'
import {customLocationNewRegExString} from '../../constants/Regex/regExNewCustomLocation'
import {regExCleanupText} from '../../constants/Regex/regExCleanupText'
import {customCleanupRegExText} from '../../constants/Regex/regExCustomCleanup'
import {commentDelimiters} from '../../shared/commentDelimiters'
import {Configuration} from '../../constants/types/configuration'
import {regExFileText} from '../../constants/Regex/regExFileInfo'

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
    // commentOpen: string,
    location: string,
    // commentClose: string,
  ) {
    if (!addedCode[location]) return match // this shouldn't happen

    return delimiters.open + ' ns__custom_start ' + location + ' ' + delimiters.close +
      addedCode[location] +
      delimiters.open + ' ns__custom_end ' + location + ' ' + delimiters.close
    // const lines = match.split('\n')
    // return lines[0] + '\n' + addedCode[location] + lines[lines.length - 1].trimLeft()
  })

  // const regExCustomLocation = new RegExp(customLocationRegExString(delimiters), 'g')
  // fileText = fileText.replace(regExCustomLocation, function (
  //   match: string,
  //   commentOpen: string,
  //   unit: string,
  //   comp: string,
  //   location: string,
  //   commentClose: string
  // ) {
  //   if (!addedCode[location]) return match // this shouldn't happen
  //
  //   // console.log(`match: ${JSON.stringify({
  //   //   match,
  //   //   commentOpen,
  //   //   unit,
  //   //   comp,
  //   //   location,
  //   //   commentClose,
  //   // })}`)
  //
  //   return commentOpen + ' ns__custom_start ' + location + ' ' + commentClose +
  //           addedCode[location] +
  //           commentOpen + ' ns__custom_end ' + location + ' ' + commentClose
  //   // const lines = match.split('\n')
  //   // return lines[0] + '\n' + addedCode[location] + lines[lines.length - 1].trimLeft()
  // })

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

  console.log(`regExReplacedCodeSectionGenerated(delimiters): ${regExReplacedCodeSectionGenerated(delimiters)}`)
  fileText = fileText.replace(regExReplacedCodeSectionGenerated(delimiters), function (
    match: string,
    // firstCommentOpen: string,
    location: string,
  ) {
    console.log(`location of match: ${location}`)
    console.log(`replacedCode: ${JSON.stringify(replacedCode)}`)

    if (!replacedCode[location]) return match
    console.log(`match: ${JSON.stringify({
      match, location})}.  replacedCode[location]=${replacedCode[location]}`)

    return match.replace('ns__start_section', 'ns__start_replacement')
  })

  // console.log(`contents of file: ${fileText}`)
  console.log(`TAGGED### regExReplacedCodeSectionTagged(delimiters): ${regExReplacedCodeSectionTagged(delimiters)}`)
  fileText = fileText.replace(regExReplacedCodeSectionTagged(delimiters), function (
    match: string,
    // firstCommentOpen: string,
    location: string,
    content: string,
  ) {
    console.log(`match: ${JSON.stringify({
      match,
      location,
      content,
    })}.  replacedCode[location]=${replacedCode[location]}`)

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
    // opening: string,
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
    // opening: string,
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
