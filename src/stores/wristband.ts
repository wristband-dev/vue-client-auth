import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import { AuthStatus, TokenResponse, type SessionResponse, AuthConfig } from '../types/auth-store'
import apiClient from '../api/api-client'
import {
  delay,
  is4xxError,
  resolveAuthProviderLoginUrl,
  validateAuthProviderLogoutUrl,
  validateAuthProviderSessionUrl,
  validateAuthProviderTokenUrl,
} from '../utils/auth-store-utils'
import { isUnauthorizedError } from '../utils/auth-utils'
import { WristbandTokenError } from '../error'

const TOKEN_EXPIRATION_BUFFER_TIME_MS = 30000
const MAX_API_ATTEMPTS = 3
const API_RETRY_DELAY_MS = 100

export const WristbandAuthStore = defineStore('wristbandAuth', () => {
  // State
  const isAuthenticated = ref(false)
  const isLoading = ref(true)
  const userId = ref('')
  const tenantId = ref('')
  const metadata = ref<Record<string, unknown>>({} as Record<string, unknown>)
  const tokenUrl = ref('')
  const accessToken = ref('')
  const accessTokenExpiresAt = ref<number>(0)
  const tokenRequestRef = ref<Promise<string> | null>(null)

  // Config (set these before calling fetchSession)
  const config = ref({
    csrfCookieName: 'CSRF-TOKEN',
    csrfHeaderName: 'X-CSRF-TOKEN',
    disableRedirectOnUnauthenticated: false,
    loginUrl: '',
    logoutUrl: '',
    sessionUrl: '',
    tokenUrl: '',
    transformSessionMetadata: undefined,
    onSessionSuccess: undefined,
  } as AuthConfig)

  // Derived
  const authStatus = computed(() =>
    isLoading.value
      ? AuthStatus.LOADING
      : isAuthenticated.value
        ? AuthStatus.AUTHENTICATED
        : AuthStatus.UNAUTHENTICATED,
  )

  // Actions
  async function setConfig(newConfig: Partial<typeof config.value>) {
    config.value = { ...config.value, ...newConfig }
    config.value.loginUrl = resolveAuthProviderLoginUrl(config.value.loginUrl)
    validateAuthProviderLogoutUrl(config.value.logoutUrl)
    validateAuthProviderSessionUrl(config.value.sessionUrl)
    if (config.value.tokenUrl && config.value.tokenUrl.length > 0) {
      validateAuthProviderTokenUrl(config.value.tokenUrl)
    }
  }

  function updateMetadata(newMetadata: Record<string, unknown>) {
    metadata.value = { ...metadata.value, ...newMetadata }
  }

  function clearToken() {
    accessToken.value = ''
    accessTokenExpiresAt.value = 0
    tokenRequestRef.value = null
  }

  async function clearAuthData() {
    isAuthenticated.value = false
    isLoading.value = true
    userId.value = ''
    tenantId.value = ''
    metadata.value = {}
    // Reset token URL
    clearToken()
    await nextTick()
  }

  async function getToken(): Promise<string> {
    const validatedTokenUrl = config.value.tokenUrl
    if (!validatedTokenUrl || !validatedTokenUrl.trim()) {
      throw new WristbandTokenError('TOKEN_URL_NOT_CONFIGURED', 'Token URL not configured')
    }
    if (!isAuthenticated.value) {
      throw new WristbandTokenError('UNAUTHENTICATED', 'User is not authenticated')
    }

    // Check if we have a valid cached token (with 30 second buffer)
    if (
      accessToken.value &&
      accessTokenExpiresAt.value > Date.now() + TOKEN_EXPIRATION_BUFFER_TIME_MS
    ) {
      return accessToken.value
    }

    // If there's already a token request in flight, return that promise
    if (tokenRequestRef.value) {
      return tokenRequestRef.value
    }

    const tokenRequest = (async () => {
      let lastError: unknown
      try {
        for (let attempt = 1; attempt <= MAX_API_ATTEMPTS; attempt++) {
          try {
            const response = await apiClient.get<TokenResponse>(validatedTokenUrl, {
              csrfCookieName: config.value.csrfCookieName,
              csrfHeaderName: config.value.csrfHeaderName,
            })
            const { accessToken: newToken, expiresAt } = response.data
            accessToken.value = newToken
            accessTokenExpiresAt.value = expiresAt
            return newToken
          } catch (error: unknown) {
            lastError = error
            if (isUnauthorizedError(error)) {
              accessToken.value = ''
              accessTokenExpiresAt.value = 0
              throw new WristbandTokenError('UNAUTHENTICATED', 'Token request unauthorized', error)
            }

            if (is4xxError(error)) {
              throw new WristbandTokenError('TOKEN_FETCH_FAILED', 'Failed to fetch token', error)
            }

            if (attempt === MAX_API_ATTEMPTS) {
              break
            }
            // Wait before retrying (only for 5xx errors and network issues)
            await delay(API_RETRY_DELAY_MS)
          }
        }

        // All attempts failed, throw the last error
        throw new WristbandTokenError(
          'TOKEN_FETCH_FAILED',
          'Failed to fetch token after multiple attempts',
          lastError,
        )
      } finally {
        // Clear the token request reference
        tokenRequestRef.value = null
      }
    })()

    // Store the promise to prevent duplicate requests
    tokenRequestRef.value = tokenRequest
    return tokenRequest
  }

  async function fetchSession() {
    const resolvedLoginUrl = resolveAuthProviderLoginUrl(config.value.loginUrl)
    const validatedLogoutUrl = config.value.logoutUrl
    const validatedSessionUrl = config.value.sessionUrl
    let lastError: unknown

    for (let attempt = 1; attempt <= MAX_API_ATTEMPTS; attempt++) {
      try {
        const response = await apiClient.get<SessionResponse>(validatedSessionUrl, {
          csrfCookieName: config.value.csrfCookieName,
          csrfHeaderName: config.value.csrfHeaderName,
        })
        const { userId: uid, tenantId: tid, metadata: rawMetadata, tokenUrl: tUrl } = response.data

        if (config.value.onSessionSuccess) {
          await Promise.resolve(config.value.onSessionSuccess(response.data))
        }

        if (rawMetadata) {
          metadata.value = config.value.transformSessionMetadata
            ? config.value.transformSessionMetadata(rawMetadata as Record<string, unknown>)
            : (rawMetadata as Record<string, unknown>)
        }

        tenantId.value = tid || ''
        userId.value = uid || ''
        isAuthenticated.value = true
        isLoading.value = false
        tokenUrl.value = tUrl || ''
        await nextTick()
      } catch (error: unknown) {
        lastError = error
        if (is4xxError(error)) {
          break
        }

        if (attempt === MAX_API_ATTEMPTS) {
          break
        }

        await delay(API_RETRY_DELAY_MS)
      }

      if (config.value.disableRedirectOnUnauthenticated) {
        isAuthenticated.value = false
        isLoading.value = false
      } else {
        window.location.href = isUnauthorizedError(lastError)
          ? resolvedLoginUrl
          : validatedLogoutUrl
      }
    }
  }

  return {
    // State
    isAuthenticated,
    isLoading,
    userId,
    tenantId,
    metadata,
    tokenUrl,
    // Derived
    authStatus,
    // Actions
    clearAuthData,
    clearToken,
    getToken,
    fetchSession,
    setConfig,
    updateMetadata,
    // Config
    config,
  }
})
