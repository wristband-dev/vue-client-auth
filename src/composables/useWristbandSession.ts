import { storeToRefs } from 'pinia'
import { WristbandAuthStore } from '../stores/wristband'

/**
 * Provides reactive access to wristband session data, including metadata, tenant ID, and user ID.
 *
 * @template TSessionData - The shape of the session metadata.
 * @returns An object containing:
 * - `metadata`: The session metadata, typed as `TSessionData`.
 * - `tenantId`: The current tenant ID.
 * - `userId`: The current user ID.
 * - `updateMetadata`: A function to update the session metadata with a partial update.
 */
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
