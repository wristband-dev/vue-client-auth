/**
 * Error codes for failures in the Wristband SDK.
 */
export enum WristbandErrorCode {
  /** An unknown error occurred. */
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  /** An invalid login URL value was provided to the SDK. */
  INVALID_LOGIN_URL = 'INVALID_LOGIN_URL',
  /** An invalid logout URL value was provided to the SDK (primarily for `redirectToLogout()`). */
  INVALID_LOGOUT_URL = 'INVALID_LOGOUT_URL',
  /** The session endpoint response is missing required fields. */
  INVALID_SESSION_RESPONSE = 'INVALID_SESSION_RESPONSE',
  /** An invalid session URL value was provided to the SDK. */
  INVALID_SESSION_URL = 'INVALID_SESSION_URL',
  /** The token endpoint response is missing required fields. */
  INVALID_TOKEN_RESPONSE = 'INVALID_TOKEN_RESPONSE',
  /** An invalid token URL value was provided to the SDK (only occurs if using `getToken()`). */
  INVALID_TOKEN_URL = 'INVALID_TOKEN_URL',
  /** The session endpoint returned an error other than 401. */
  SESSION_FETCH_FAILED = 'SESSION_FETCH_FAILED',
  /** The token endpoint returned an error other than 401. */
  TOKEN_FETCH_FAILED = 'TOKEN_FETCH_FAILED',
  /** The user is not authenticated and cannot request a session or token. */
  UNAUTHENTICATED = 'UNAUTHENTICATED',
}
