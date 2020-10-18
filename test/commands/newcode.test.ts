import {expect, test} from '@oclif/test'
describe('newcode', () => {
  test
  .stderr()
  .command(['newcode', '-c', 'codeBase', '-s', 'nonExistentStarter'])
  .catch(error => {
    expect(error.message).to.contain('the folder for nonExistentStarter does not exist.')
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
