import { WristbandError } from '../error'
import { WristbandAuthStore } from '../stores/wristband'
import { type AuthConfig } from 'types/auth-store'
import { WristbandErrorCode } from '../types/errors'

export function useWristbandToken(): Pick<AuthConfig, 'getToken' | 'clearToken'> {
  const store = WristbandAuthStore()
  if (!store) {
    throw new WristbandError(
      WristbandErrorCode.INVALID_TOKEN_RESPONSE,
      'useWristbandToken() must be used within a WristbandAuthProvider.',
    )
  }
  const { getToken, clearToken } = store

  return { clearToken, getToken }
}
