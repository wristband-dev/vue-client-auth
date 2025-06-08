import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthStatus, type SessionResponse } from '@/types/auth-store'
import apiClient from '../api/api-client'
import {
  resolveAuthProviderLoginUrl,
  validateAuthProviderLogoutUrl,
  validateAuthProviderSessionUrl,
} from '@/utils/auth-store-utils'
import { isUnauthorizedError } from '@/utils/auth-utils'

export const WristbandAuthStore = defineStore('wristbandAuth', () => {
  // State
  const isAuthenticated = ref(false)
  const isLoading = ref(true)
  const userId = ref('')
  const tenantId = ref('')
  const metadata = ref<Record<string, unknown>>({})

  // Config (set these before calling fetchSession)
  const config = ref({
    csrfCookieName: 'CSRF-TOKEN',
    csrfHeaderName: 'X-CSRF-TOKEN',
    disableRedirectOnUnauthenticated: false,
    loginUrl: '',
    logoutUrl: '',
    sessionUrl: '',
    transformSessionMetadata: undefined as ((raw: unknown) => any) | undefined,
    onSessionSuccess: undefined as ((session: SessionResponse) => void) | undefined,
  })

  // Derived
  const authStatus = computed(() =>
    isLoading.value
      ? AuthStatus.LOADING
      : isAuthenticated.value
        ? AuthStatus.AUTHENTICATED
        : AuthStatus.UNAUTHENTICATED,
  )

  // Actions
  function setConfig(newConfig: Partial<typeof config.value>) {
    config.value = { ...config.value, ...newConfig }
    config.value.loginUrl = resolveAuthProviderLoginUrl(config.value.loginUrl)
    validateAuthProviderLogoutUrl(config.value.logoutUrl)
    validateAuthProviderSessionUrl(config.value.sessionUrl)
  }

  function updateMetadata(newMetadata: Record<string, any>) {
    metadata.value = { ...metadata.value, ...newMetadata }
  }

  async function fetchSession() {
    try {
      const response = await apiClient.get<SessionResponse>(config.value.sessionUrl, {
        csrfCookieName: config.value.csrfCookieName,
        csrfHeaderName: config.value.csrfHeaderName,
      })
      const { userId: uid, tenantId: tid, metadata: rawMetadata } = response.data

      if (config.value.onSessionSuccess) {
        await Promise.resolve(config.value.onSessionSuccess(response.data))
      }

      if (rawMetadata) {
        metadata.value = config.value.transformSessionMetadata
          ? config.value.transformSessionMetadata(rawMetadata)
          : rawMetadata
      }

      tenantId.value = tid || ''
      userId.value = uid || ''
      isAuthenticated.value = true
      isLoading.value = false
    } catch (error: any) {
      console.log(error)
      if (config.value.disableRedirectOnUnauthenticated) {
        isAuthenticated.value = false
        isLoading.value = false
      } else {
        window.location.href = isUnauthorizedError(error)
          ? config.value.loginUrl
          : config.value.logoutUrl
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
    // Derived
    authStatus,
    // Actions
    setConfig,
    updateMetadata,
    fetchSession,
    // Config
    config,
  }
})
