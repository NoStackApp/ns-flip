import {expect, test} from '@oclif/test'

// describe('generate', () => {
//   test
//     .stderr()
//     .command(['generate', 'nonExistentCode', '-t', 'nonExistentTemplate', '--noSetup'])
//     .catch(error => {
//       expect(error.message).to.contain('Missing 1 required arg')
//     })
//     .it('requires existing template')
// })

describe('generate', () => {
  test.stderr()
  .command(['generate', 'nonExistentCode', '-t', 'nonExistentTemplate', '--noSetup'])
  .exit(1)
  .it('requires existing template', ctx => {
    console.log(`ctx=${JSON.stringify(ctx)}`)
    expect(ctx.stderr).to.contain('Missing 1 required arg')
  })
})
