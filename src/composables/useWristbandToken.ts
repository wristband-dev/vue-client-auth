import { WristbandAuthStore } from '../stores/wristband'
import { type AuthConfig } from 'types/auth-store'

export function useWristbandToken(): Pick<AuthConfig, 'getToken' | 'clearToken'> {
  const store = WristbandAuthStore()
  const { getToken, clearToken } = store
  if (store === undefined) {
    throw new Error('useWristbandToken() must be used within a WristbandAuthProvider.')
  }

  return { clearToken, getToken }
}
