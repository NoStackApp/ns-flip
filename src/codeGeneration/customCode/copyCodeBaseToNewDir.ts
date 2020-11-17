import execa = require('execa');
import {copyProjectDirectory} from '../../templates/copyProjectDirectory'

const fs = require('fs-extra')

export async function copyCodeBaseToNewDir(codeDir: string, newDir: string) {
  const isCodeDir = await fs.pathExists(codeDir)

  if (!isCodeDir) {
    throw new Error(`the directory ${codeDir} does not exist. Please confirm it or create it separately`)
  }

  try {
    await copyProjectDirectory(codeDir, newDir)
  } catch (error) {
    console.error(error)
    throw new Error(`could not copy ${codeDir} to ${newDir}`)
  }
  // try {
  //   await fs.copy(baseApp, testCodeDir)
  //   console.log('success!')
  // } catch (err) {
  //   console.error(err)
  // }
  // await execa(
  //   'cp',
  //   ['-r', codeDir, newDir],
  // ).catch(
  //   (error: any) => {
  //     throw new Error(`error copying over from ${codeDir}: ${error}`)
  //   },
  // )
}
