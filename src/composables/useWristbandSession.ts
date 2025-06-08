import { storeToRefs } from 'pinia'
import { WristbandAuthStore } from '@/stores/wristband'

export function useWristbandSession<TSessionData = unknown>() {
  const store = WristbandAuthStore()
  const { metadata, tenantId, userId } = storeToRefs(store)

  return {
    metadata: metadata as unknown as TSessionData,
    tenantId,
    userId,
    updateMetadata: (newMetadata: Partial<TSessionData>) => {
      store.updateMetadata(newMetadata as Record<string, unknown>)
    },
  }
}
