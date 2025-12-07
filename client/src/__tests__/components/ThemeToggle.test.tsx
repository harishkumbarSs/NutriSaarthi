/**
 * ThemeToggle Component Tests
 * ===========================
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { useThemeStore } from '../../stores/themeStore'

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset theme store before each test
    useThemeStore.setState({ theme: 'dark' })
  })

  it('renders the theme toggle button', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('toggles theme when clicked', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    
    // Initial state should be dark
    expect(useThemeStore.getState().theme).toBe('dark')
    
    // Click to toggle
    fireEvent.click(button)
    expect(useThemeStore.getState().theme).toBe('light')
    
    // Click again to toggle back
    fireEvent.click(button)
    expect(useThemeStore.getState().theme).toBe('dark')
  })
})

