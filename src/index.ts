// Export Pinia store
export { WristbandAuthStore } from './stores/wristband'

// Export composables (eg. hooks)
export { useWristbandStore } from './composables/useWristbandAuthStore'
export { useWristbandSession } from './composables/useWristbandSession'
export { useWristbandToken } from './composables/useWristbandToken'

// Export types
export { AuthStatus, type SessionResponse } from './types/auth-store'
export type { LoginRedirectConfig, LogoutRedirectConfig } from './types/auth-utils'

// Export errors
export { WristbandError } from './error'

// Export utils
export { redirectToLogin, redirectToLogout } from './utils/auth-utils'
