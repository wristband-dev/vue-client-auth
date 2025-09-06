import { storeToRefs } from 'pinia'
import { WristbandAuthStore } from '../stores/wristband'
import { type AuthConfig } from '../types/auth-store'

/**
 * Composable function to access and configure the Wristband authentication store.
 *
 * @param config - Optional authentication configuration to initialize the store with.
 * @returns An object containing reactive references to authentication state:
 * - `authStatus`: The current authentication status.
 * - `authError`: Any authentication error encountered.
 * - `isAuthenticated`: Indicates if the user is authenticated.
 * - `isLoading`: Indicates if authentication status is being determined.
 */
export function useWristbandStore(config?: AuthConfig) {
  const store = WristbandAuthStore()
  const { setConfig } = store
  const { authError, authStatus, isAuthenticated, isLoading } = storeToRefs(store)

  if (config) {
    setConfig(config)
  }

  return {
    authError,
    authStatus,
    isAuthenticated,
    isLoading,
  }
}
