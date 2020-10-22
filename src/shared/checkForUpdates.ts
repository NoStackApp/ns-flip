const updateNotifier = require('update-notifier')
const pkg = require('../../package.json')

export function checkForUpdates() {
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 2, // 2 days
  })

  if (notifier.update) {
    // eslint-disable-next-line no-console
    console.log(`Update available: ${notifier.update.latest}`)
  }
}
