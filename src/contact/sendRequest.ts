const request = require('request')

const got = require('got')

export async function sendRequest(url: string, json: any) {
  console.log(`in sendRequest.  url=${url}`)
  let response
  // const {body} = await got.post('url', {
  //   json,
  //   responseType: 'json',
  // })
  // try {
  //   response = await request({
  //     uri: url,
  //     method: 'POST',
  //     json,
  //   })
  //   console.log('no error reported yet')
  //   // console.log(response)
  // } catch (error) {
  //   console.log('error!')
  //   console.log(error.response.statusCode)
  //   // => 'Internal server error ...'
  // }
  //
  // return response

  try {
    response = await got.post(url, {
      json,
      method: 'POST',
    })

    console.log(response.body)
    // => '<!doctype html> ...'
  } catch (error) {
    console.log('error!')
    console.log(error.response.body)
    // => 'Internal server error ...'
  }
  return response

  // request(url, function (error: any, response: any, body: any) {
  //   if (!error && response.statusCode === 200) {
  //     console.log('body =' + body)
  //   } else {
  //     console.log('Error ' + response.statusCode)
  //   }
  // })
}

