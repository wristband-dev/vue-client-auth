import { describe, it, expect } from 'vitest'

import * as api from './index'

describe('Public API exports', () => {
  it('should export Wristband Store', () => {
    expect(api.WristbandAuthStore).toBeDefined()
    expect(typeof api.WristbandAuthStore).toBe('function')
  })

  it('should export useWristbandStore hook', () => {
    expect(api.useWristbandStore).toBeDefined()
    expect(typeof api.useWristbandStore).toBe('function')
  })

  it('should export useWristbandSession hook', () => {
    expect(api.useWristbandSession).toBeDefined()
    expect(typeof api.useWristbandSession).toBe('function')
  })

  it('should export AuthStatus enum', () => {
    expect(api.AuthStatus).toBeDefined()
    expect(api.AuthStatus.LOADING).toBe('loading')
    expect(api.AuthStatus.AUTHENTICATED).toBe('authenticated')
    expect(api.AuthStatus.UNAUTHENTICATED).toBe('unauthenticated')
  })

  it('should export utility functions', () => {
    expect(api.redirectToLogin).toBeDefined()
    expect(typeof api.redirectToLogin).toBe('function')

    expect(api.redirectToLogout).toBeDefined()
    expect(typeof api.redirectToLogout).toBe('function')
  })

  it('should not export any unexpected members', () => {
    const expectedExports = [
      'WristbandAuthStore',
      'useWristbandStore',
      'useWristbandSession',
      'useWristbandToken',
      'AuthStatus',
      'WristbandTokenError',
      'redirectToLogin',
      'redirectToLogout',
    ]

    // Get all keys that aren't types
    const actualExports = Object.keys(api)

    // Ensure all expected exports exist
    expectedExports.forEach((exportName) => {
      expect(actualExports).toContain(exportName)
    })

    // Ensure there are no unexpected exports
    expect(actualExports.length).toBe(expectedExports.length)
    actualExports.forEach((exportName) => {
      expect(expectedExports).toContain(exportName)
    })
  })
})
