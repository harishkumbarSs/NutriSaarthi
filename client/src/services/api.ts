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

// ============================================
// WATER TRACKING API
// ============================================

export const waterApi = {
  getToday: async (): Promise<ApiResponse<{
    today: {
      total: number
      target: number
      entries: Array<{ _id: string; amount: number; date: string; time: string; createdAt: string }>
      percentage: number
    }
    weekly: Array<{ date: string; amount: number; target: number }>
    streak: number
  }>> => {
    const response = await api.get('/water/today')
    return response.data
  },

  add: async (data: { amount: number; time?: string }): Promise<ApiResponse<{ entry: { _id: string; amount: number } }>> => {
    const response = await api.post('/water', data)
    return response.data
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/water/${id}`)
    return response.data
  },

  getHistory: async (startDate: string, endDate: string): Promise<ApiResponse<{
    entries: Array<{ date: string; total: number; target: number }>
  }>> => {
    const response = await api.get('/water/history', { params: { startDate, endDate } })
    return response.data
  },
}

// ============================================
// MEAL PLAN API
// ============================================

export const mealPlanApi = {
  getWeek: async (weekStart: string): Promise<ApiResponse<{
    weekStart: string
    days: Array<{
      date: string
      meals: Array<{
        _id: string
        name: string
        mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
        calories: number
        protein: number
        carbs: number
        fat: number
        notes?: string
      }>
      totalCalories: number
    }>
  }>> => {
    const response = await api.get('/meal-plans/week', { params: { weekStart } })
    return response.data
  },

  add: async (data: {
    date: string
    mealType: string
    name: string
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    notes?: string
  }): Promise<ApiResponse<{ meal: object }>> => {
    const response = await api.post('/meal-plans', data)
    return response.data
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/meal-plans/${id}`)
    return response.data
  },

  copyDay: async (fromDate: string, toDate: string): Promise<ApiResponse<{ copied: number }>> => {
    const response = await api.post('/meal-plans/copy', { fromDate, toDate })
    return response.data
  },
}

// ============================================
// FOOD DATABASE API
// ============================================

export const foodApi = {
  search: async (query: string, limit = 25): Promise<ApiResponse<{
    foods: Array<{
      id: string
      name: string
      brand: string
      servingSize: number
      servingUnit: string
      calories: number
      protein: number
      carbs: number
      fat: number
      fiber: number
      category: string
      source: string
    }>
    totalResults: number
    sources: string[]
  }>> => {
    const response = await api.get('/foods/search', { params: { query, limit } })
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<{ food: object }>> => {
    const response = await api.get(`/foods/${id}`)
    return response.data
  },

  getCategories: async (): Promise<ApiResponse<{ categories: string[] }>> => {
    const response = await api.get('/foods/categories')
    return response.data
  },
}

// ============================================
// PROGRESS API EXTENSION
// ============================================

// Extend dashboardApi for progress tracking
dashboardApi.getProgress = async (period: string): Promise<ApiResponse<{
  weight: {
    current: number
    start: number
    change: number
    history: Array<{ date: string; weight: number }>
  }
  calories: {
    average: number
    target: number
    trend: Array<{ date: string; consumed: number; target: number }>
  }
  macros: {
    averageProtein: number
    averageCarbs: number
    averageFat: number
    distribution: Array<{ name: string; value: number }>
  }
  streaks: {
    current: number
    longest: number
    goalsReached: number
  }
}>> => {
  const response = await api.get('/dashboard/progress', { params: { period } })
  return response.data
}

export default api

