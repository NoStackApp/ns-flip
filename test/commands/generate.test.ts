import {expect, test} from '@oclif/test'
describe('generate', () => {
  test
  .stderr()
  .command(['generate', '-t', 'nonExistentTemplate', '--noSetup'])
  .catch(error => {
    expect(error.message).to.contain('Missing 1 required arg')
  })
  .it('requires existing template')
})

// describe('generate', () => {
//   test.stderr()
//   .command(['generate', '-c', 'nonexistantDir'])
//   .exit(1)
//   .it('complain that dir not found', ctx => {
//     expect(ctx.stderr).to.contain('no such file or directory')
//   })
// })
