/**
 * Auth Store Tests
 * =================
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../../stores/authStore'

describe('authStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
    })
  })

  it('should initialize with default values', () => {
    const state = useAuthStore.getState()
    
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(true)
  })

  it('should set auth correctly', () => {
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      profile: {},
      dailyTargets: { calories: 2000, protein: 50, carbs: 250, fat: 65, fiber: 25, water: 8 },
      preferences: { dietType: 'none' as const, allergies: [], dislikedFoods: [] },
    }
    const mockToken = 'test-token-123'

    useAuthStore.getState().setAuth(mockUser, mockToken)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
    expect(state.isAuthenticated).toBe(true)
    expect(state.isLoading).toBe(false)
  })

  it('should logout correctly', () => {
    // First set some auth
    useAuthStore.getState().setAuth(
      {
        id: '123',
        name: 'Test',
        email: 'test@test.com',
        profile: {},
        dailyTargets: { calories: 2000, protein: 50, carbs: 250, fat: 65, fiber: 25, water: 8 },
        preferences: { dietType: 'none', allergies: [], dislikedFoods: [] },
      },
      'token'
    )

    // Then logout
    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should update user correctly', () => {
    // Set initial auth
    useAuthStore.getState().setAuth(
      {
        id: '123',
        name: 'Test',
        email: 'test@test.com',
        profile: {},
        dailyTargets: { calories: 2000, protein: 50, carbs: 250, fat: 65, fiber: 25, water: 8 },
        preferences: { dietType: 'none', allergies: [], dislikedFoods: [] },
      },
      'token'
    )

    // Update user
    useAuthStore.getState().updateUser({ name: 'Updated Name' })

    expect(useAuthStore.getState().user?.name).toBe('Updated Name')
  })
})

