/**
 * Meal Planner Page
 * =================
 * Weekly meal planning with calendar view and scheduling.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Plus,
  Trash2,
  ChefHat,
  Clock,
  UtensilsCrossed,
  Copy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { mealPlanApi } from '../services/api'
import { AnimatedContainer, AnimatedItem, AnimatedButton } from '../components/ui/PageTransition'
import clsx from 'clsx'
import toast from 'react-hot-toast'

interface PlannedMeal {
  _id: string
  name: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  calories: number
  protein: number
  carbs: number
  fat: number
  notes?: string
}

interface DayPlan {
  date: string
  meals: PlannedMeal[]
  totalCalories: number
}

interface WeekPlan {
  weekStart: string
  days: DayPlan[]
}

// Meal type configuration
const MEAL_TYPES = [
  { type: 'breakfast', label: 'Breakfast', icon: '🌅', time: '7:00 AM', color: 'orange' },
  { type: 'lunch', label: 'Lunch', icon: '☀️', time: '12:30 PM', color: 'yellow' },
  { type: 'dinner', label: 'Dinner', icon: '🌙', time: '7:30 PM', color: 'blue' },
  { type: 'snack', label: 'Snacks', icon: '🍎', time: 'Any time', color: 'green' },
]

// Sample meal suggestions
const MEAL_SUGGESTIONS = [
  { name: 'Oatmeal with fruits', mealType: 'breakfast', calories: 320, protein: 8, carbs: 54, fat: 8 },
  { name: 'Grilled chicken salad', mealType: 'lunch', calories: 420, protein: 35, carbs: 20, fat: 22 },
  { name: 'Vegetable curry with rice', mealType: 'dinner', calories: 550, protein: 14, carbs: 72, fat: 22 },
  { name: 'Greek yogurt parfait', mealType: 'snack', calories: 180, protein: 12, carbs: 24, fat: 4 },
  { name: 'Eggs and toast', mealType: 'breakfast', calories: 350, protein: 18, carbs: 28, fat: 18 },
  { name: 'Dal tadka with roti', mealType: 'lunch', calories: 480, protein: 18, carbs: 62, fat: 16 },
  { name: 'Paneer tikka', mealType: 'dinner', calories: 380, protein: 22, carbs: 12, fat: 28 },
  { name: 'Mixed nuts', mealType: 'snack', calories: 170, protein: 5, carbs: 8, fat: 15 },
]

const MealPlanner = () => {
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<string>('breakfast')

  // Form state
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: '',
  })

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const fetchWeekPlan = async () => {
    setIsLoading(true)
    try {
      const response = await mealPlanApi.getWeek(format(weekStart, 'yyyy-MM-dd'))
      if (response.success && response.data) {
        setWeekPlan(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch meal plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWeekPlan()
  }, [weekStart])

  const handlePrevWeek = () => {
    setWeekStart(addDays(weekStart, -7))
  }

  const handleNextWeek = () => {
    setWeekStart(addDays(weekStart, 7))
  }

  const handleAddMeal = async () => {
    if (!newMeal.name) {
      toast.error('Please enter a meal name')
      return
    }

    try {
      const response = await mealPlanApi.add({
        date: format(selectedDate, 'yyyy-MM-dd'),
        mealType: selectedMealType,
        name: newMeal.name,
        calories: parseInt(newMeal.calories) || 0,
        protein: parseInt(newMeal.protein) || 0,
        carbs: parseInt(newMeal.carbs) || 0,
        fat: parseInt(newMeal.fat) || 0,
        notes: newMeal.notes,
      })

      if (response.success) {
        toast.success('Meal added to plan!')
        setShowAddModal(false)
        setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '', notes: '' })
        fetchWeekPlan()
      }
    } catch (error) {
      toast.error('Failed to add meal')
    }
  }

  const handleDeleteMeal = async (mealId: string) => {
    try {
      const response = await mealPlanApi.delete(mealId)
      if (response.success) {
        toast.success('Meal removed from plan')
        fetchWeekPlan()
      }
    } catch (error) {
      toast.error('Failed to remove meal')
    }
  }

  const handleUseSuggestion = (suggestion: typeof MEAL_SUGGESTIONS[0]) => {
    setNewMeal({
      name: suggestion.name,
      calories: suggestion.calories.toString(),
      protein: suggestion.protein.toString(),
      carbs: suggestion.carbs.toString(),
      fat: suggestion.fat.toString(),
      notes: '',
    })
    setSelectedMealType(suggestion.mealType)
  }

  const handleCopyDay = async (fromDate: string) => {
    try {
      const response = await mealPlanApi.copyDay(fromDate, format(selectedDate, 'yyyy-MM-dd'))
      if (response.success) {
        toast.success('Day copied successfully!')
        fetchWeekPlan()
      }
    } catch (error) {
      toast.error('Failed to copy day')
    }
  }

  const getDayPlan = (date: Date): DayPlan | undefined => {
    return weekPlan?.days.find(d => isSameDay(new Date(d.date), date))
  }

  const getMealsForType = (date: Date, mealType: string): PlannedMeal[] => {
    const dayPlan = getDayPlan(date)
    return dayPlan?.meals.filter(m => m.mealType === mealType) || []
  }

  return (
    <AnimatedContainer className="space-y-6">
      {/* Header */}
      <AnimatedItem>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <Calendar className="w-7 h-7 text-primary-400" />
              Meal Planner
            </h2>
            <p className="text-gray-400 mt-1">Plan your meals for the week</p>
          </div>
          <AnimatedButton
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Meal
          </AnimatedButton>
        </div>
      </AnimatedItem>

      {/* Week Navigation */}
      <AnimatedItem>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevWeek}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h3 className="text-lg font-semibold text-white">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </h3>
            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Day selector */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayPlan = getDayPlan(day)
              const isSelected = isSameDay(day, selectedDate)
              const isToday = isSameDay(day, new Date())

              return (
                <motion.button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={clsx(
                    'p-3 rounded-xl text-center transition-all',
                    isSelected
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-800/50 hover:bg-gray-700/50',
                    isToday && !isSelected && 'ring-2 ring-primary-500/50'
                  )}
                >
                  <p className={clsx(
                    'text-xs',
                    isSelected ? 'text-primary-200' : 'text-gray-400'
                  )}>
                    {format(day, 'EEE')}
                  </p>
                  <p className={clsx(
                    'text-lg font-bold',
                    isSelected ? 'text-white' : 'text-gray-200'
                  )}>
                    {format(day, 'd')}
                  </p>
                  {dayPlan && dayPlan.meals.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {dayPlan.meals.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className={clsx(
                            'w-1.5 h-1.5 rounded-full',
                            isSelected ? 'bg-white' : 'bg-primary-400'
                          )}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </AnimatedItem>

      {/* Selected Day Plan */}
      <AnimatedItem>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              <p className="text-sm text-gray-400">
                {getDayPlan(selectedDate)?.totalCalories || 0} calories planned
              </p>
            </div>
            {getDayPlan(selectedDate)?.meals.length ? (
              <button
                onClick={() => handleCopyDay(format(selectedDate, 'yyyy-MM-dd'))}
                className="btn-ghost flex items-center gap-2"
              >
                <Copy size={16} />
                Copy Day
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEAL_TYPES.map(({ type, label, icon, time, color }) => {
              const meals = getMealsForType(selectedDate, type)

              return (
                <div
                  key={type}
                  className={clsx(
                    'p-4 rounded-xl border transition-colors',
                    `bg-${color}-500/5 border-${color}-500/20`
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{icon}</span>
                      <span className="font-medium text-white">{label}</span>
                    </div>
                    <span className="text-xs text-gray-400">{time}</span>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {meals.length > 0 ? (
                      <motion.div className="space-y-2">
                        {meals.map((meal) => (
                          <motion.div
                            key={meal._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group bg-gray-800/50 rounded-lg p-3 relative"
                          >
                            <button
                              onClick={() => handleDeleteMeal(meal._id)}
                              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 
                                       hover:bg-red-500/20 rounded transition-all"
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </button>
                            <p className="font-medium text-white text-sm pr-6">{meal.name}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {meal.calories} cal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                            </p>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => {
                          setSelectedMealType(type)
                          setShowAddModal(true)
                        }}
                        className="w-full py-6 border-2 border-dashed border-gray-700 rounded-lg 
                                 text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors"
                      >
                        <Plus className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">Add meal</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </AnimatedItem>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-primary-400" />
                  Add Meal to Plan
                </h3>
                <span className="text-sm text-gray-400">
                  {format(selectedDate, 'MMM d')}
                </span>
              </div>

              {/* Meal Type Selector */}
              <div className="flex gap-2 mb-6">
                {MEAL_TYPES.map(({ type, label, icon }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMealType(type)}
                    className={clsx(
                      'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                      selectedMealType === type
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    )}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              {/* Quick Suggestions */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                  <Sparkles size={14} /> Quick suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {MEAL_SUGGESTIONS
                    .filter(s => s.mealType === selectedMealType)
                    .map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleUseSuggestion(suggestion)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 
                                 rounded-full text-xs text-gray-300 transition-colors"
                      >
                        {suggestion.name}
                      </button>
                    ))
                  }
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="label">Meal Name</label>
                  <input
                    type="text"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Grilled chicken salad"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Calories</label>
                    <input
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                      className="input-field"
                      placeholder="kcal"
                    />
                  </div>
                  <div>
                    <label className="label">Protein (g)</label>
                    <input
                      type="number"
                      value={newMeal.protein}
                      onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                      className="input-field"
                      placeholder="grams"
                    />
                  </div>
                  <div>
                    <label className="label">Carbs (g)</label>
                    <input
                      type="number"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                      className="input-field"
                      placeholder="grams"
                    />
                  </div>
                  <div>
                    <label className="label">Fat (g)</label>
                    <input
                      type="number"
                      value={newMeal.fat}
                      onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                      className="input-field"
                      placeholder="grams"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Notes (optional)</label>
                  <textarea
                    value={newMeal.notes}
                    onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                    className="input-field resize-none"
                    rows={2}
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <AnimatedButton
                  onClick={handleAddMeal}
                  className="btn-primary flex-1"
                >
                  Add to Plan
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedContainer>
  )
}

export default MealPlanner

