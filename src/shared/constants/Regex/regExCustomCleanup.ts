// for backward compatibility
import {commentClose, commentOpen, locationSpec} from './regExShared'

export const customCleanupRegExText = `${commentOpen} ns__custom_(start|end) unit: ${locationSpec}${commentClose}`
