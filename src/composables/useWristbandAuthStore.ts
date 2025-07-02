import { storeToRefs } from 'pinia'
import { AuthConfig, WristbandAuthStore } from '../stores/wristband'

/**
 * Composable function to access and configure the Wristband authentication store.
 *
 * @param config - Optional authentication configuration to initialize the store with.
 * @returns An object containing reactive references to authentication state:
 * - `isAuthenticated`: Indicates if the user is authenticated.
 * - `isLoading`: Indicates if authentication status is being determined.
 * - `authStatus`: The current authentication status.
 */
export function useWristbandStore(config?: AuthConfig) {
  const store = WristbandAuthStore()
  const { setConfig } = store
  const { isAuthenticated, isLoading, authStatus } = storeToRefs(store)

  if (config) {
    setConfig(config)
  }

  return {
    isAuthenticated,
    isLoading,
    authStatus,
  }
}
