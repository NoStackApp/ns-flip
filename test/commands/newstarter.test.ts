import {expect, test} from '@oclif/test'
describe('newstarter', () => {
  test
  .stderr()
  .command(['newstarter', '-s', 'testStarter', '-t', 'nonExistentTemplate'])
  .catch(error => {
    expect(error.message).to.contain('error finding the config file nonExistentTemplate')
  })
  .it('requires existing starter')
})

// describe('generate', () => {
//   test.stderr()
//   .command(['generate', '-c', 'nonexistantDir'])
//   .exit(1)
//   .it('complain that dir not found', ctx => {
//     expect(ctx.stderr).to.contain('no such file or directory')
//   })
// })
