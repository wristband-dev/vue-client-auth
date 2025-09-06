import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WristbandAuthStore } from '../stores/wristband'
import { useWristbandToken } from './useWristbandToken'

vi.mock('../stores/wristband', () => ({
  WristbandAuthStore: vi.fn(),
}))

describe('useWristbandToken', () => {
  const mockGetToken = vi.fn().mockResolvedValue('token-value-1234')
  const mockClearToken = vi.fn()

  beforeEach(() => {
    ;(WristbandAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getToken: mockGetToken,
      clearToken: mockClearToken,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return getToken() and clearToken() methods by calling the WristbandAuthStore factory', () => {
    const { getToken, clearToken } = useWristbandToken()

    expect(typeof getToken).toBe('function')
    expect(typeof clearToken).toBe('function')
    expect(WristbandAuthStore).toHaveBeenCalled()
  })

  it('calls the method getToken', async () => {
    const { getToken } = useWristbandToken()

    const val = await getToken()
    expect(mockGetToken).toHaveBeenCalled()
    expect(val).toBe('token-value-1234')
  })

  it('delegates the method clearToken', () => {
    const { clearToken } = useWristbandToken()

    clearToken()
    expect(mockClearToken).toHaveBeenCalled()
  })

  it('throws when the WristbandAuthStore factory returns undefined', () => {
    ;(WristbandAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(undefined)
    expect(() => useWristbandToken()).toThrow()
  })
})
