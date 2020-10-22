import {expect, test} from '@oclif/test'
describe('regenerate', () => {
  test
  .stderr()
  .command(['regenerate', '-c', 'nonexix'])
  .catch(error => {
    expect(error.message).to.contain('no such file or directory')
  })
  .it('requires existent code base')
})

// describe('regenerate', () => {
//   test.stderr()
//   .command(['regenerate', '-c', 'nonexistantDir'])
//   .exit(1)
//   .it('complain that dir not found', ctx => {
//     expect(ctx.stderr).to.contain('no such file or directory')
//   })
// })
