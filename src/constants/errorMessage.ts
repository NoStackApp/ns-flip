const chalk = require('chalk')

export const errorMessage = (details: string) => `installation error: ${chalk.red(details)}. If needed, please contact NoStack support: info@nostack.net.`
