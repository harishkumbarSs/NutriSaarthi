/**
 * API Service
 * ===========
 * Centralized API calls using Axios.
 * Handles authentication headers and error responses.
 */

import axios from 'axios'
import { 
  ApiResponse, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData,
  User,
  DashboardData,
  Meal,
  MealFormData,
  PaginatedResponse,
  Recommendation
} from '../types'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // Vite proxy will forward to backend
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (Zustand persist storage)
    const authStorage = localStorage.getItem('nutrisaarthi-auth')
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage)
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`
        }
      } catch {
        // Invalid storage, ignore
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      // Clear auth storage and redirect to login
      localStorage.removeItem('nutrisaarthi-auth')
      window.location.href = '/login'
    }
    
    return Promise.reject(new Error(message))
  }
)

// ============================================
// AUTH API
// ============================================

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/auth/profile', data)
    return response.data
  },

  updateTargets: async (targets: Partial<User['dailyTargets']>): Promise<ApiResponse<{ dailyTargets: User['dailyTargets'] }>> => {
    const response = await api.put('/auth/targets', targets)
    return response.data
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<{ token: string }>> => {
    const response = await api.put('/auth/password', { currentPassword, newPassword })
    return response.data
  },
}

// ============================================
// MEAL API
// ============================================

export interface GetMealsParams {
  page?: number
  limit?: number
  mealType?: string
  startDate?: string
  endDate?: string
  favorite?: boolean
  sort?: string
}

export const mealApi = {
  getMeals: async (params: GetMealsParams = {}): Promise<PaginatedResponse<Meal>> => {
    const response = await api.get('/meals', { params })
    return response.data
  },

  getMealById: async (id: string): Promise<ApiResponse<{ meal: Meal }>> => {
    const response = await api.get(`/meals/${id}`)
    return response.data
  },

  getMealsByDate: async (date: string): Promise<ApiResponse<{
    date: string
    summary: {
      totalCalories: number
      totalProtein: number
      totalCarbs: number
      totalFat: number
      mealCount: number
    }
    meals: Record<string, Meal[]>
    total: number
  }>> => {
    const response = await api.get(`/meals/date/${date}`)
    return response.data
  },

  createMeal: async (data: MealFormData): Promise<ApiResponse<{ meal: Meal }>> => {
    const response = await api.post('/meals', data)
    return response.data
  },

  updateMeal: async (id: string, data: Partial<MealFormData>): Promise<ApiResponse<{ meal: Meal }>> => {
    const response = await api.put(`/meals/${id}`, data)
    return response.data
  },

  deleteMeal: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/meals/${id}`)
    return response.data
  },

  toggleFavorite: async (id: string): Promise<ApiResponse<{ isFavorite: boolean }>> => {
    const response = await api.patch(`/meals/${id}/favorite`)
    return response.data
  },

  duplicateMeal: async (id: string, data?: { mealType?: string; consumedAt?: string }): Promise<ApiResponse<{ meal: Meal }>> => {
    const response = await api.post(`/meals/${id}/duplicate`, data)
    return response.data
  },
}

// ============================================
// DASHBOARD API
// ============================================

export const dashboardApi = {
  getDashboard: async (): Promise<ApiResponse<DashboardData>> => {
    const response = await api.get('/dashboard')
    return response.data
  },

  getTodaySummary: async (): Promise<ApiResponse<{
    date: string
    consumed: {
      calories: number
      protein: number
      carbs: number
      fat: number
    }
    targets: User['dailyTargets']
    progress: Record<string, number>
    remaining: Record<string, number>
    mealCount: number
  }>> => {
    const response = await api.get('/dashboard/today')
    return response.data
  },

  getTrends: async (period: '7d' | '14d' | '30d' | '90d' = '7d'): Promise<ApiResponse<{
    period: string
    trends: Array<{ date: string; calories: number; protein: number; carbs: number; fat: number; mealCount: number }>
    summary: {
      totalDays: number
      daysWithMeals: number
      totals: Record<string, number>
      averages: Record<string, number>
    }
  }>> => {
    const response = await api.get('/dashboard/trends', { params: { period } })
    return response.data
  },

  getMacros: async (date?: string, period?: 'day' | 'week' | 'month'): Promise<ApiResponse<{
    totals: Record<string, number>
    distribution: Record<string, number>
  }>> => {
    const response = await api.get('/dashboard/macros', { params: { date, period } })
    return response.data
  },

  getWeeklyOverview: async (): Promise<ApiResponse<{
    days: Array<{ date: string; dayName: string; calories: number; target: number; percentage: number; mealsLogged: number }>
    summary: Record<string, number>
  }>> => {
    const response = await api.get('/dashboard/weekly-overview')
    return response.data
  },
}

// ============================================
// RECOMMENDATION API
// ============================================

export const recommendationApi = {
  getRecommendations: async (): Promise<ApiResponse<{
    count: number
    recommendations: Recommendation[]
  }>> => {
    const response = await api.get('/recommendations')
    return response.data
  },

  getMealSuggestions: async (mealType: string): Promise<ApiResponse<{
    mealType: string
    remainingNutrition: Record<string, number>
    suggestions: Array<{
      name: string
      nutrition: Record<string, number>
      tags: string[]
      matchScore: number
    }>
  }>> => {
    const response = await api.get(`/recommendations/meals/${mealType}`)
    return response.data
  },

  getInsights: async (): Promise<ApiResponse<{
    period: string
    daysTracked: number
    averages: Record<string, number>
    insights: Array<{
      type: string
      title: string
      message: string
      icon: string
    }>
  }>> => {
    const response = await api.get('/recommendations/insights')
    return response.data
  },
}

export default api

