// for backward compatibility
import {closing, locationSpec, opening} from './regExShared'

export const regExCleanupText = `${opening}ns__(start|end)_(section|replacement) unit: ${locationSpec}${closing}`
