/**
 * FoodSearchInput Component
 * =========================
 * Autocomplete search input for food database.
 * Searches local foods and USDA database with debounced queries.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Loader2, UtensilsCrossed, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { foodApi } from '../../services/api'
import { FoodItem } from '../../types'
import clsx from 'clsx'

interface FoodSearchInputProps {
  value: string
  onChange: (value: string) => void
  onFoodSelect: (food: FoodItem) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

const FoodSearchInput = ({
  value,
  onChange,
  onFoodSelect,
  placeholder = 'Search for a food...',
  className = '',
  disabled = false,
}: FoodSearchInputProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [hasSearched, setHasSearched] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounce search query
  const debouncedQuery = useDebounce(value, 300)

  // Search foods when query changes
  useEffect(() => {
    const searchFoods = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        setHasSearched(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await foodApi.search(debouncedQuery, 10)
        if (response.success && response.data) {
          setResults(response.data.foods)
          setHasSearched(true)
        }
      } catch (error) {
        console.error('Food search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    searchFoods()
  }, [debouncedQuery])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' && results.length > 0) {
          setIsOpen(true)
          setSelectedIndex(0)
          e.preventDefault()
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleSelectFood(results[selectedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          setSelectedIndex(-1)
          break
      }
    },
    [isOpen, results, selectedIndex]
  )

  const handleSelectFood = (food: FoodItem) => {
    onChange(food.name)
    onFoodSelect(food)
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const handleClear = () => {
    onChange('')
    setResults([])
    setHasSearched(false)
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setIsOpen(true)
    setSelectedIndex(-1)
  }

  const handleFocus = () => {
    if (results.length > 0 || value.length >= 2) {
      setIsOpen(true)
    }
  }

  return (
    <div className={clsx('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            'w-full pl-12 pr-12 py-3 rounded-xl transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            backgroundColor: 'rgb(var(--color-surface))',
            border: '1px solid rgb(var(--color-border))',
            color: 'rgb(var(--color-text-primary))',
          }}
          autoComplete="off"
        />
        
        {/* Right side icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
          )}
          {value && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          )}
          {!isLoading && !value && (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (results.length > 0 || (hasSearched && value.length >= 2)) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 rounded-xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: 'rgb(var(--color-surface))',
              border: '1px solid rgb(var(--color-border))',
            }}
          >
            {results.length > 0 ? (
              <ul className="max-h-72 overflow-y-auto py-2">
                {results.map((food, index) => (
                  <li key={food.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectFood(food)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={clsx(
                        'w-full px-4 py-3 text-left transition-colors flex items-start gap-3',
                        index === selectedIndex
                          ? 'bg-primary-500/10'
                          : 'hover:bg-gray-800/50'
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                        <UtensilsCrossed className="w-5 h-5 text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white truncate">
                            {food.name}
                          </span>
                          {food.source === 'local' && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary-500/20 text-primary-400 rounded">
                              Local
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate">
                          {food.brand} • {food.servingSize} {food.servingUnit}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          <span className="text-primary-400 font-medium">{food.calories} cal</span>
                          {' • '}P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : hasSearched && value.length >= 2 ? (
              <div className="px-4 py-6 text-center">
                <UtensilsCrossed className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                <p className="text-gray-400 text-sm">No foods found</p>
                <p className="text-gray-500 text-xs mt-1">
                  Continue typing to enter custom food
                </p>
              </div>
            ) : null}

            {/* Hint for manual entry */}
            {results.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-800 bg-gray-900/50">
                <p className="text-xs text-gray-500">
                  💡 Select a food or keep typing for custom entry
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FoodSearchInput

