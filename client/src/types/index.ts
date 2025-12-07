/**
 * TypeScript Type Definitions
 * ===========================
 * Central location for all type definitions used across the app.
 */

// ============================================
// USER TYPES
// ============================================

export interface UserProfile {
  age?: number
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  height?: number
  weight?: number
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
  goal?: 'lose-weight' | 'maintain' | 'gain-weight' | 'build-muscle'
}

export interface DailyTargets {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  water: number
}

export interface UserPreferences {
  dietType?: 'none' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean'
  allergies?: string[]
  dislikedFoods?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  profile: UserProfile
  dailyTargets: DailyTargets
  preferences: UserPreferences
  createdAt?: string
  lastLogin?: string
}

// ============================================
// MEAL TYPES
// ============================================

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
}

export interface ServingSize {
  amount: number
  unit: 'g' | 'ml' | 'oz' | 'cup' | 'tbsp' | 'tsp' | 'piece' | 'serving'
}

export interface Meal {
  _id: string
  name: string
  description?: string
  mealType: MealType
  nutrition: Nutrition
  servingSize: ServingSize
  consumedAt: string
  imageUrl?: string
  tags?: string[]
  notes?: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface MealFormData {
  name: string
  description?: string
  mealType: MealType
  nutrition: Nutrition
  servingSize?: ServingSize
  consumedAt?: string
  tags?: string[]
  notes?: string
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DailyProgress {
  consumed: number
  target: number
  remaining: number
  percentage: number
}

export interface TodaySummary {
  calories: DailyProgress
  protein: DailyProgress
  carbs: DailyProgress
  fat: DailyProgress
  mealCount: number
}

export interface WeeklyChartData {
  date: string
  calories: number
  mealCount: number
}

export interface MealTypeDistribution {
  type: MealType
  count: number
  totalCalories: number
}

export interface DashboardData {
  user: {
    name: string
    goal: string
    dailyTargets: DailyTargets
  }
  today: TodaySummary
  weeklyChart: WeeklyChartData[]
  recentMeals: Pick<Meal, '_id' | 'name' | 'mealType' | 'consumedAt'>[]
  mealTypeDistribution: MealTypeDistribution[]
}

// ============================================
// RECOMMENDATION TYPES
// ============================================

export interface Recommendation {
  category: string
  priority: number
  title: string
  message: string
  action?: string
  icon: string
  suggestions?: string[]
}

export interface MealSuggestion {
  name: string
  nutrition: Nutrition
  tags: string[]
  matchScore: number
}

export interface WeeklyInsight {
  type: 'positive' | 'warning' | 'suggestion'
  title: string
  message: string
  icon: string
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

// ============================================
// FOOD DATABASE TYPES
// ============================================

export interface FoodItem {
  id: string
  name: string
  brand: string
  servingSize: number
  servingUnit: string
  servingWeight: number
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sodium?: number
  category: string
  source: 'local' | 'usda'
}

