import {expect, test} from '@oclif/test'
describe('check', function () {
  test
  .stderr()
  .command(['check', 'nonexistentFile'])
  .catch(error => {
    expect(error.message).to.contain('no such file or directory')
  })
  .it('requires existent code base')
})

// describe('generate', () => {
//   test.stderr()
//   .command(['generate', '-c', 'nonexistantDir'])
//   .exit(1)
//   .it('complain that dir not found', ctx => {
//     expect(ctx.stderr).to.contain('no such file or directory')
//   })
// })
