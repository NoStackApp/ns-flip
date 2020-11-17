const fs = require('fs-extra')

export async function copyCodeBaseToNewDir(codeDir: string, newDir: string) {
  const isCodeDir = await fs.pathExists(codeDir)

  if (!isCodeDir) {
    throw new Error(`the directory ${codeDir} does not exist. Please confirm it or create it separately`)
  }

  // try {
  //   await copyProjectDirectory(codeDir, newDir)
  // } catch (error) {
  //   console.error(error)
  //   throw new Error(`could not copy ${codeDir} to ${newDir}`)
  // }
  try {
    await fs.copy(codeDir, newDir)
  } catch (error) {
    throw new Error(`unable to copy ${codeDir} to ${newDir}: ${error}`)
  }
  // await execa(
  //   'cp',
  //   ['-r', codeDir, newDir],
  // ).catch(
  //   (error: any) => {
  //     throw new Error(`error copying over from ${codeDir}: ${error}`)
  //   },
  // )
}
