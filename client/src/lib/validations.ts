/**
 * Form Validation Schemas
 * =======================
 * Zod schemas for form validation with error messages.
 */

import { z } from 'zod';

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ============================================
// PROFILE SCHEMAS
// ============================================

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  age: z
    .number()
    .min(1, 'Age must be at least 1')
    .max(150, 'Please enter a valid age')
    .optional()
    .nullable(),
  gender: z
    .enum(['male', 'female', 'other', 'prefer-not-to-say'])
    .optional()
    .nullable(),
  height: z
    .number()
    .min(50, 'Height must be at least 50 cm')
    .max(300, 'Height must not exceed 300 cm')
    .optional()
    .nullable(),
  weight: z
    .number()
    .min(20, 'Weight must be at least 20 kg')
    .max(500, 'Weight must not exceed 500 kg')
    .optional()
    .nullable(),
  activityLevel: z
    .enum(['sedentary', 'light', 'moderate', 'active', 'very-active'])
    .optional()
    .nullable(),
  goal: z
    .enum(['lose-weight', 'maintain', 'gain-weight', 'build-muscle'])
    .optional()
    .nullable(),
});

export const dailyTargetsSchema = z.object({
  calories: z
    .number()
    .min(500, 'Calories must be at least 500')
    .max(10000, 'Calories must not exceed 10,000'),
  protein: z
    .number()
    .min(0, 'Protein cannot be negative')
    .max(500, 'Protein must not exceed 500g'),
  carbs: z
    .number()
    .min(0, 'Carbs cannot be negative')
    .max(1000, 'Carbs must not exceed 1000g'),
  fat: z
    .number()
    .min(0, 'Fat cannot be negative')
    .max(500, 'Fat must not exceed 500g'),
});

// ============================================
// MEAL SCHEMAS
// ============================================

export const mealSchema = z.object({
  name: z
    .string()
    .min(1, 'Meal name is required')
    .max(100, 'Meal name must not exceed 100 characters'),
  mealType: z
    .enum(['breakfast', 'lunch', 'dinner', 'snack']),
  calories: z
    .number()
    .min(0, 'Calories cannot be negative')
    .max(10000, 'Calories seem too high'),
  protein: z
    .number()
    .min(0, 'Protein cannot be negative')
    .optional(),
  carbs: z
    .number()
    .min(0, 'Carbs cannot be negative')
    .optional(),
  fat: z
    .number()
    .min(0, 'Fat cannot be negative')
    .optional(),
  notes: z
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .optional(),
});

export const waterEntrySchema = z.object({
  amount: z
    .number()
    .min(1, 'Amount must be at least 1')
    .max(5000, 'Amount must not exceed 5000 ml'),
  unit: z
    .enum(['ml', 'glass', 'bottle', 'liter'])
    .optional(),
  note: z
    .string()
    .max(100, 'Note must not exceed 100 characters')
    .optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type DailyTargetsFormData = z.infer<typeof dailyTargetsSchema>;
export type MealFormData = z.infer<typeof mealSchema>;
export type WaterEntryFormData = z.infer<typeof waterEntrySchema>;

