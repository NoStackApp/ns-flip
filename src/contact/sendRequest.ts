import {feedbackForm} from '../shared/constants'

const got = require('got')

export async function sendRequest(
  messageType: string,
  subject: string,
  message: string,
  email?: string
) {
  const formData: any = {
    [feedbackForm.fields.MESSAGE_TYPE]: messageType,
    [feedbackForm.fields.SUBJECT]: subject,
    [feedbackForm.fields.MESSAGE]: message,
    submit: 'Submit',
  }

  if (email) {
    formData[feedbackForm.fields.EMAIL] = email
  }

  let output
  try {
    output = await got.post(feedbackForm.URL, {form: formData})
  } catch (error) {
    throw new Error(`cannot send feedback message: ${error.response.body}`)
  }
  return output
}
