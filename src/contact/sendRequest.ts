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

// export async function sendRequest(url: string, json: any) {
//   console.log(`in sendRequest.  url=${url}`)
//   let response
//   // const {body} = await got.post('url', {
//   //   json,
//   //   responseType: 'json',
//   // })
//   try {
//     response = await request({
//       uri: 'https://docs.google.com/forms/d/1DooR4toIL-15Ozk6cxB1A8gMJR5e3dntalYAr60PM9Q/formResponse -d "entry.1563192314=generate" -d "entry.7330959=does that work?" -d "entry.1551316295=rlj613@gmail.com" -d "entry.2118049504=Suggestion" -d submit=Submit',
//       method: 'POST',
//     })
//     console.log(`no error reported yet. response.body=${JSON.stringify(response.body, null, 2)}`)
//     // console.log(response)
//   } catch (error) {
//     console.log('error!')
//     console.log(error.response.statusCode)
//     // => 'Internal server error ...'
//   }
//
//   return response
//
//   try {
//     response = await got.post('https://httpbin.org/anything', {
//       json: {
//         hello: 'world',
//       },
//       responseType: 'json',
//     })
//     console.log(`response.body=${JSON.stringify(response.body, null, 2)}`)
//
//     // response = await got.post(url, {
//     //   json,
//     //   method: 'POST',
//     // })
//     // console.log(response.body)
//
//     // => '<!doctype html> ...'
//   } catch (error) {
//     console.log('error!')
//     console.log(error.response.body)
//     // => 'Internal server error ...'
//   }
//   return response.body
//
//   // request('https://httpbin.org/anything', function (error: any, response: any, body: any) {
//   //   if (!error && response.statusCode === 200) {
//   //     console.log('body =' + body)
//   //   } else {
//   //     console.log('Error ' + response.statusCode)
//   //   }
//   // })
// }
//
