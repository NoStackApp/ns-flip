const https = require('https')

/*
https://docs.google.com/forms/d/1DooR4toIL-15Ozk6cxB1A8gMJR5e3dntalYAr60PM9Q/formResponse -d "entry.1563192314=generate" -d "entry.7330959=does that work 4?" -d "entry.1551316295=rlj613@gmail.com" -d "entry.2118049504=Suggestion" -d submit=Submit
 */

// const data = JSON.stringify({
//   'entry.1563192314': 'generate',
//   'entry.7330959': 'does that work 3?',
//   'entry.1551316295': 'rlj613@gmail.com',
//   'entry.2118049504': 'Suggestion',
//   submit: 'Submit',
// })

const data = JSON.stringify(
  {
    'entry.1563192314': 'trying2',
    'entry.7330959': 'try2',
    'entry.1551316295': 'rlj613@gmail.com',
    'entry.2118049504': 'Message',
    'entry.2118049504_sentinel': '',
    fvv: '1',
    draftResponse: '[null,null,"7562496312623939983"]\r\n',
    pageHistory: '0',
    fbzx: '7562496312623939983',
  }
)

const options = {
  hostname: 'docs.google.com',
  // hostname: 'httpbin.org',
  port: 443,
  path: '/forms/d/1DooR4toIL-15Ozk6cxB1A8gMJR5e3dntalYAr60PM9Q/formResponse',
  // path: '/anything',
  method: 'GET',
  headers: {
    // 'Content-Type': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length,
  },
}

export function sendRequestHardCoded() {
  const req = https.request(options, (res: any) => {
    console.log(`statusCode: ${res.statusCode}`)

    // res.on('data', (d: any) => {
    //   process.stdout.write(d)
    // })
  })

  req.on('error', (error: any) => {
    console.error('error received')
    console.error(JSON.stringify(error))
  })

  req.write(data)
  req.end()
}

