// Export Pinia store
export { WristbandAuthStore } from './stores/wristband'

// Export composables (eg. hooks)
export { useWristbandAuth } from '@/composables/useWristbandAuth'
export { useWristbandSession } from '@/composables/useWristbandSession'

// Export types
export { AuthStatus, type SessionResponse } from '@/types/auth-store'
export type { LoginRedirectConfig, LogoutRedirectConfig } from '@/types/auth-utils'

// Export utils
export { redirectToLogin, redirectToLogout } from './utils/auth-utils'
