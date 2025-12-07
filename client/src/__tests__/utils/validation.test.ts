/**
 * Validation Utils Tests
 * ======================
 */

import { describe, it, expect } from 'vitest'

// Simple validation functions for testing
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

const isValidCalories = (calories: number): boolean => {
  return calories >= 0 && calories <= 10000
}

const isValidMacro = (value: number): boolean => {
  return value >= 0 && value <= 500
}

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.org')).toBe(true)
    })

    it('should return false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('missing@domain')).toBe(false)
      expect(isValidEmail('@nodomain.com')).toBe(false)
    })
  })

  describe('isValidPassword', () => {
    it('should return true for valid passwords', () => {
      expect(isValidPassword('123456')).toBe(true)
      expect(isValidPassword('longpassword')).toBe(true)
      expect(isValidPassword('Pass@123')).toBe(true)
    })

    it('should return false for short passwords', () => {
      expect(isValidPassword('')).toBe(false)
      expect(isValidPassword('12345')).toBe(false)
      expect(isValidPassword('abc')).toBe(false)
    })
  })

  describe('isValidCalories', () => {
    it('should return true for valid calorie values', () => {
      expect(isValidCalories(0)).toBe(true)
      expect(isValidCalories(2000)).toBe(true)
      expect(isValidCalories(10000)).toBe(true)
    })

    it('should return false for invalid calorie values', () => {
      expect(isValidCalories(-1)).toBe(false)
      expect(isValidCalories(10001)).toBe(false)
    })
  })

  describe('isValidMacro', () => {
    it('should return true for valid macro values', () => {
      expect(isValidMacro(0)).toBe(true)
      expect(isValidMacro(50)).toBe(true)
      expect(isValidMacro(500)).toBe(true)
    })

    it('should return false for invalid macro values', () => {
      expect(isValidMacro(-1)).toBe(false)
      expect(isValidMacro(501)).toBe(false)
    })
  })
})

