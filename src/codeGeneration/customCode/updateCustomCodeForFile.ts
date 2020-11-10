import {FileCustomCode} from '../../constants/types/custom'
import {customLocationRegExString} from '../../constants/Regex/regExCustomLocation'
import {
  regExReplacedCodeSectionGenerated,
  regExReplacedCodeSectionTagged,
} from '../../constants/Regex/regExReplacedCodeSection'
import {customLocationNewRegExString} from '../../constants/Regex/regExNewCustomLocation'
import {regExCleanupText} from '../../constants/Regex/regExCleanupText'
import {customCleanupRegExText} from '../../constants/Regex/regExCustomCleanup'

export const fs = require('fs-extra')

export async function updateCustomCodeForFile(filePath: string, fileCustomCode: FileCustomCode) {
  let fileText: string

  try {
    fileText = await fs.readFile(filePath, 'utf-8')
  } catch (error) {
    throw new Error(`couldn't read the file ${filePath}`)
  }

  const {addedCode, replacedCode} = fileCustomCode

  /*

OLD:
    const unit: string = match[2]
    const component: string = match[3]
    const location: string = match[4]

    // const firstLineEnding = match[5]
    let contents = match[6]

NEW:
      const {unit, component} = fileInfo
    const location: string = match[2]

    // const firstLineEnding = match[5]
    let contents = match[4]

   */
  const regExNewCustomLocation = new RegExp(customLocationNewRegExString, 'g')

  fileText = fileText.replace(regExNewCustomLocation, function (
    match: string,
    commentOpen: string,
    location: string,
    commentClose: string,
  ) {
    if (!addedCode[location]) return match // this shouldn't happen

    // console.log(`match: ${JSON.stringify({
    //   match,
    //   commentOpen,
    //   unit,
    //   comp,
    //   location,
    //   commentClose,
    // })}`)

    return commentOpen + ' ns__custom_start ' + location + ' ' + commentClose +
      addedCode[location] +
      commentOpen + ' ns__custom_end ' + location + ' ' + commentClose
    // const lines = match.split('\n')
    // return lines[0] + '\n' + addedCode[location] + lines[lines.length - 1].trimLeft()
  })

  const regExCustomLocation = new RegExp(customLocationRegExString, 'g')
  fileText = fileText.replace(regExCustomLocation, function (
    match: string,
    commentOpen: string,
    unit: string,
    comp: string,
    location: string,
    commentClose: string
  ) {
    if (!addedCode[location]) return match // this shouldn't happen

    // console.log(`match: ${JSON.stringify({
    //   match,
    //   commentOpen,
    //   unit,
    //   comp,
    //   location,
    //   commentClose,
    // })}`)

    return commentOpen + ' ns__custom_start ' + location + ' ' + commentClose +
            addedCode[location] +
            commentOpen + ' ns__custom_end ' + location + ' ' + commentClose
    // const lines = match.split('\n')
    // return lines[0] + '\n' + addedCode[location] + lines[lines.length - 1].trimLeft()
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

  fileText = fileText.replace(regExReplacedCodeSectionGenerated, function (
    match: string,
    firstCommentOpen: string,
    location: string,
  ) {
    if (!replacedCode[location]) return match

    return match.replace('ns__start_section', 'ns__start_replacement')
  })

  fileText = fileText.replace(regExReplacedCodeSectionTagged, function (
    match: string,
    firstCommentOpen: string,
    location: string,
    endOfLine: string,
    content: string,
    p7: string,
    commentOpen: string,
    finalEndOfLine: string,
  ) {
    if (!replacedCode[location]) return match
    const lines = match.split('\n')

    const fullReplacement = lines[0] +
            '\n' + replacedCode[location] +
            commentOpen +
            ` ns__end_replacement ${location} ` +
            finalEndOfLine
    return fullReplacement
  })

  // clean up
  const regExCleanUp = new RegExp(regExCleanupText, 'g')

  fileText = fileText.replace(regExCleanUp, function (
    match: string,
    opening: string,
    prefix: string,
    type: string,
    p3: string,
    p4: string,
    location: string,
    endOfLine: string,
  ) {
    return `${opening} ns__${prefix}_${type} ${location}${endOfLine}`
  })

  const regExCustomCleanUp = new RegExp(customCleanupRegExText, 'g')

  fileText = fileText.replace(regExCustomCleanUp, function (
    match: string,
    opening: string,
    prefix: string,
    p3: string,
    p4: string,
    location: string,
    endOfLine: string,
  ) {
    return `${opening} ns__custom_${prefix} ${location}${endOfLine}`
  })

  try {
    await fs.outputFile(filePath, fileText)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
