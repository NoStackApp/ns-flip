// const copyDir = require('copy-dir')
//
// export function copyProjectDirectory(srcDir: string, destDir: string) {
//   copyDir.sync(srcDir, destDir, {
//     filter: function (stat: string, filepath: string) {
//       if (stat === 'symbolicLink') {
//         return false
//       }
//       return filepath.split('/').indexOf('.git') <= -1
//     },
//   })
// }
