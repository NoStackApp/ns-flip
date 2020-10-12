import {checkDirForDiscrepancies} from '../testing/checkDirForDiscrepancies'

const dirsToCheck = [
  'src/components/NavBar',
  'src/config',
  'src/custom',
  'src/client',
  'src/components/DeleteInstanceMenu',
  'src/components/EditInstanceForm',
  'src/components/LoginForm',
  'src/components/ForgotPasswordButton',
  'src/components/ForgotPasswordButton/ResetPasswordForm.js',
  'src/components/ForgotPasswordButton/SendCodeForm.js',
  'src/components/RegistrationForm',
  'src/components/RegistrationForm/RegistrationForm.style.js',
  'src/components/RegistrationForm/RegistrationField.js',
  'src/components/AuthTabs',
  'src/client',
  'src/flattenData',
  'src/index.js',
  'src/App.js',
]

// const filesToCheck = [
//   'src/index.js',
//   'src/App.js',
// ]

export async function checkStaticFiles(
  diffsDir: string,
  originalApp: string,
  logFile: string,
  problemsFound: boolean,
) {
  await Promise.all(dirsToCheck.map(async (dir: string) => {
    const fileName = dir.split('/').pop() || ''
    const diffsFile = `${diffsDir}/${fileName.replace('.js', '')}`
    const originalUnit = `${originalApp}/${dir}`
    const generatedUnit = `${originalApp}.test/${dir}`

    const problemsFoundLocally = await checkDirForDiscrepancies(
      diffsFile,
      originalUnit,
      generatedUnit,
      logFile,
      problemsFound)
    problemsFound = problemsFound || problemsFoundLocally
  }))
  return problemsFound
}
