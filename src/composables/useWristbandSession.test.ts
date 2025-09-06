import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useWristbandSession } from './useWristbandSession'
import { storeToRefs } from 'pinia'
import { WristbandAuthStore } from '../stores/wristband'

vi.mock('pinia', () => ({
  storeToRefs: vi.fn(),
}))
vi.mock('../stores/wristband', () => ({
  WristbandAuthStore: vi.fn(),
}))

describe('useWristbandSession', () => {
  const mockMetadata = { foo: 'bar' }
  const mockTenantId = 'tenant-123'
  const mockUserId = 'user-456'
  let updateMetadataMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    updateMetadataMock = vi.fn()
    ;(WristbandAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      updateMetadata: updateMetadataMock,
    })
    ;(storeToRefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      metadata: mockMetadata,
      tenantId: mockTenantId,
      userId: mockUserId,
    })
  })

  it('returns metadata, tenantId, userId, and updateMetadata', () => {
    const session = useWristbandSession<typeof mockMetadata>()
    expect(session.metadata).toBe(mockMetadata)
    expect(session.tenantId).toBe(mockTenantId)
    expect(session.userId).toBe(mockUserId)
    expect(typeof session.updateMetadata).toBe('function')
  })

  it('calls store.updateMetadata with correct arguments', () => {
    const session = useWristbandSession<typeof mockMetadata>()
    const partialUpdate = { foo: 'baz' }
    session.updateMetadata(partialUpdate)
    expect(updateMetadataMock).toHaveBeenCalledWith(partialUpdate)
  })
})
