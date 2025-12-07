/**
 * Auth Store (Zustand)
 * ====================
 * Manages authentication state across the application.
 * 
 * Zustand is a lightweight state management library.
 * Think of it as a simpler alternative to Redux.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginCredentials, RegisterData } from '../types'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'

interface AuthState {
  // State
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  checkAuth: () => Promise<void>
  clearError: () => void
}

/**
 * Auth Store with persistence
 * Token is stored in localStorage for persistence across page reloads
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading to check persisted auth
      error: null,

      // Login Action
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authApi.login(credentials)
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            })
            toast.success('Welcome back!')
            return true
          } else {
            set({ error: response.message, isLoading: false })
            toast.error(response.message)
            return false
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed'
          set({ error: message, isLoading: false })
          toast.error(message)
          return false
        }
      },

      // Register Action
      register: async (data) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authApi.register(data)
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            })
            toast.success('Account created successfully!')
            return true
          } else {
            set({ error: response.message, isLoading: false })
            toast.error(response.message)
            return false
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed'
          set({ error: message, isLoading: false })
          toast.error(message)
          return false
        }
      },

      // Logout Action
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
        toast.success('Logged out successfully')
      },

      // Update User (after profile edit)
      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } })
        }
      },

      // Check if token is still valid on app load
      checkAuth: async () => {
        const token = get().token
        
        if (!token) {
          set({ isLoading: false, isAuthenticated: false })
          return
        }

        try {
          const response = await authApi.getMe()
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            // Token is invalid, clear auth state
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        } catch {
          // Token is invalid
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'nutrisaarthi-auth', // localStorage key
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, validate the token
        if (state?.token) {
          state.checkAuth()
        } else {
          state?.checkAuth() // This will set isLoading to false
        }
      },
    }
  )
)

