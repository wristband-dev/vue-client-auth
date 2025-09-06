import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useWristbandStore } from './useWristbandAuthStore'
import { storeToRefs } from 'pinia'
import { WristbandAuthStore } from '../stores/wristband'

vi.mock('pinia', () => ({
  storeToRefs: vi.fn(),
}))
vi.mock('../stores/wristband', () => ({
  WristbandAuthStore: vi.fn(),
}))

describe('useWristbandStore', () => {
  const mockSetConfig = vi.fn()
  const mockRefs = {
    isAuthenticated: { value: false },
    isLoading: { value: false },
    authStatus: { value: 'unknown' },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(WristbandAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      setConfig: mockSetConfig,
    })
    ;(storeToRefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockRefs)
  })

  it('returns reactive refs from the store', () => {
    const result = useWristbandStore()
    expect(result.isAuthenticated).toBe(mockRefs.isAuthenticated)
    expect(result.isLoading).toBe(mockRefs.isLoading)
    expect(result.authStatus).toBe(mockRefs.authStatus)
  })

  it('calls setConfig if config is provided', () => {
    const config = { some: 'config' }
    useWristbandStore(config as never)
    expect(mockSetConfig).toHaveBeenCalledWith(config)
  })

  it('does not call setConfig if config is not provided', () => {
    useWristbandStore()
    expect(mockSetConfig).not.toHaveBeenCalled()
  })
})
