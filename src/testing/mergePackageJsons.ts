<<<<<<< HEAD
import {merge} from 'merge-anything'

// const readPkg = require('read-pkg')
=======
// import {merge} from 'merge-anything'

const readPkg = require('read-pkg')
>>>>>>> resolvedTSCError
// const merge = require('merge-package.json')
const fs = require('fs-extra')

// Overwrites any existing key properties from currentJson with originalJson
export async function mergePackageJsons(originalDir: string, currentDir: string) {
<<<<<<< HEAD
  // const originalJson = await readPkg({cwd: originalDir})
  // const currentJson = await readPkg({cwd: currentDir})

  const originalJson = await fs.readJson(`${originalDir}/package.json`)
  const currentJson = await fs.readJson(`${currentDir}/package.json`)

  const merged = merge(currentJson, originalJson)
=======
  const originalJson = await readPkg({cwd: originalDir})
  const currentJson = await readPkg({cwd: currentDir})

  // const originalJson = await fs.readJson(`${originalDir}/package.json`)
  // const currentJson = await fs.readJson(`${currentDir}/package.json`)

  // const merged = merge(currentJson, originalJson)
>>>>>>> resolvedTSCError
  // const merged = merge(
  //   JSON.stringify(currentJson),
  //   JSON.stringify(currentJson),
  //   JSON.stringify(originalJson),
  // )

  // return JSON.parse(merged)
<<<<<<< HEAD
  return merged
=======

  // return merged
  return currentJson
>>>>>>> resolvedTSCError
}
