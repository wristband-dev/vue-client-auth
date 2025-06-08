import { storeToRefs } from 'pinia'
import { useWristbandAuthStore } from '@/stores/wristband'

export function useWristbandAuth() {
  const store = useWristbandAuthStore()
  const { isAuthenticated, isLoading, authStatus } = storeToRefs(store)

  return {
    isAuthenticated,
    isLoading,
    authStatus,
  }
}
