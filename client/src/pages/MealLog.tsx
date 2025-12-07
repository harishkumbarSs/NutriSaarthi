/**
 * Meal Log Page
 * =============
 * View and manage meal entries with add/edit functionality.
 * Uses virtualization for efficient rendering of large lists.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { 
  Plus, 
  Calendar, 
  Filter,
  UtensilsCrossed,
  Trash2,
  Edit3,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { motion, AnimatePresence } from 'framer-motion'
import { mealApi } from '../services/api'
import { Meal, MealType, MealFormData, FoodItem } from '../types'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { MealItemSkeleton } from '../components/ui/Skeleton'
import FoodSearchInput from '../components/ui/FoodSearchInput'

// Meal Type Badge Component
const MealTypeBadge = ({ type }: { type: MealType }) => {
  const styles = {
    breakfast: 'bg-orange-500/20 text-orange-400',
    lunch: 'bg-blue-500/20 text-blue-400',
    dinner: 'bg-purple-500/20 text-purple-400',
    snack: 'bg-green-500/20 text-green-400',
  }

  return (
    <span className={clsx('px-2 py-1 rounded-lg text-xs font-medium capitalize', styles[type])}>
      {type}
    </span>
  )
}

// Virtualized Meal List Component for performance
const VirtualizedMealList = ({
  meals,
  isLoading,
  onEdit,
  onDelete,
  onToggleFavorite,
  onAddFirst,
}: {
  meals: Meal[]
  isLoading: boolean
  onEdit: (meal: Meal) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
  onAddFirst: () => void
}) => {
  const parentRef = useRef<HTMLDivElement>(null)

  // Virtual list configuration
  const virtualizer = useVirtualizer({
    count: meals.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated row height
    overscan: 5, // Render 5 extra items outside viewport
  })

  if (isLoading) {
    return (
      <div className="glass-card overflow-hidden p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <MealItemSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (meals.length === 0) {
    return (
      <div className="glass-card text-center py-16">
        <UtensilsCrossed className="w-16 h-16 mx-auto text-gray-700 mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No meals found</h3>
        <p className="text-gray-500 mb-6">Start tracking your nutrition journey!</p>
        <button onClick={onAddFirst} className="btn-primary">
          Add your first meal
        </button>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      <div
        ref={parentRef}
        className="min-h-[200px] max-h-[600px] overflow-auto"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <AnimatePresence mode="popLayout">
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const meal = meals[virtualRow.index]
              return (
                <motion.div
                  key={meal._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="border-b border-gray-800 last:border-b-0"
                >
                  <div className="p-4 sm:p-6 hover:bg-gray-800/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                          <UtensilsCrossed className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-white">{meal.name}</h3>
                            <MealTypeBadge type={meal.mealType} />
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            {format(new Date(meal.consumedAt), 'h:mm a')}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-primary-400">{meal.nutrition.calories} kcal</span>
                            <span className="text-gray-500">P: {meal.nutrition.protein}g</span>
                            <span className="text-gray-500">C: {meal.nutrition.carbs}g</span>
                            <span className="text-gray-500">F: {meal.nutrition.fat}g</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onToggleFavorite(meal._id)}
                          className={clsx(
                            'p-2 rounded-lg transition-colors',
                            meal.isFavorite
                              ? 'text-red-400 bg-red-500/10'
                              : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                          )}
                        >
                          <Heart size={18} fill={meal.isFavorite ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => onEdit(meal)}
                          className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(meal._id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Add Meal Modal Component
const AddMealModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  editMeal 
}: { 
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MealFormData) => Promise<void>
  editMeal: Meal | null
}) => {
  const [formData, setFormData] = useState<MealFormData>({
    name: '',
    mealType: 'breakfast',
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)

  useEffect(() => {
    if (editMeal) {
      setFormData({
        name: editMeal.name,
        description: editMeal.description,
        mealType: editMeal.mealType,
        nutrition: editMeal.nutrition,
        notes: editMeal.notes,
      })
      setSelectedFood(null)
    } else {
      setFormData({
        name: '',
        mealType: 'breakfast',
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      })
      setSelectedFood(null)
    }
  }, [editMeal, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle food selection from search
  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food)
    setFormData({
      ...formData,
      name: food.name,
      nutrition: {
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        fiber: food.fiber,
      },
      servingSize: {
        amount: food.servingSize,
        unit: food.servingUnit as MealFormData['servingSize'] extends { unit: infer U } ? U : 'g',
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-display font-bold text-white">
            {editMeal ? 'Edit Meal' : 'Add New Meal'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Food Search */}
          <div>
            <label className="label">Search Food</label>
            <FoodSearchInput
              value={formData.name}
              onChange={(name) => setFormData({ ...formData, name })}
              onFoodSelect={handleFoodSelect}
              placeholder="Type to search foods..."
              disabled={!!editMeal}
            />
            {!editMeal && (
              <p className="text-xs text-gray-500 mt-1.5">
                Search our database or type a custom food name
              </p>
            )}
          </div>

          {/* Selected Food Info */}
          {selectedFood && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 bg-primary-500/10 border border-primary-500/30 rounded-xl"
            >
              <UtensilsCrossed className="w-5 h-5 text-primary-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{selectedFood.name}</p>
                <p className="text-xs text-gray-400">
                  {selectedFood.brand} • {selectedFood.servingSize} {selectedFood.servingUnit}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFood(null)
                  setFormData({
                    ...formData,
                    name: '',
                    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
                  })
                }}
                className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </motion.div>
          )}

          {/* Meal Type */}
          <div>
            <label className="label">Meal Type</label>
            <div className="grid grid-cols-4 gap-2">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, mealType: type })}
                  className={clsx(
                    'py-2 px-3 rounded-xl text-sm font-medium transition-all capitalize',
                    formData.mealType === type
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Nutrition Grid */}
          <div>
            <label className="label">Nutrition Information</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Calories (kcal)</label>
                <input
                  type="number"
                  value={formData.nutrition.calories || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, calories: Number(e.target.value) }
                  })}
                  className="input-field mt-1"
                  placeholder="0"
                  required
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Protein (g)</label>
                <input
                  type="number"
                  value={formData.nutrition.protein || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, protein: Number(e.target.value) }
                  })}
                  className="input-field mt-1"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Carbs (g)</label>
                <input
                  type="number"
                  value={formData.nutrition.carbs || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, carbs: Number(e.target.value) }
                  })}
                  className="input-field mt-1"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Fat (g)</label>
                <input
                  type="number"
                  value={formData.nutrition.fat || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, fat: Number(e.target.value) }
                  })}
                  className="input-field mt-1"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes (optional)</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field resize-none h-20"
              placeholder="Any additional notes..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? 'Saving...' : editMeal ? 'Update Meal' : 'Add Meal'}
          </button>
        </form>
      </div>
    </div>
  )
}

const MealLog = () => {
  const [meals, setMeals] = useState<Meal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [filterType, setFilterType] = useState<MealType | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchMeals = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string | number> = {
        page,
        limit: 10,
        sort: '-consumedAt',
      }

      if (filterType !== 'all') {
        params.mealType = filterType
      }

      if (selectedDate) {
        params.startDate = selectedDate
        params.endDate = selectedDate
      }

      const response = await mealApi.getMeals(params)
      
      if (response.success) {
        setMeals(response.data)
        setTotalPages(response.pagination.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch meals:', error)
      toast.error('Failed to load meals')
    } finally {
      setIsLoading(false)
    }
  }, [page, filterType, selectedDate])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  const handleAddMeal = async (data: MealFormData) => {
    try {
      const response = await mealApi.createMeal({
        ...data,
        consumedAt: new Date().toISOString(),
      })
      
      if (response.success) {
        toast.success('Meal added successfully!')
        fetchMeals()
      }
    } catch (error) {
      toast.error('Failed to add meal')
    }
  }

  const handleEditMeal = async (data: MealFormData) => {
    if (!editingMeal) return
    
    try {
      const response = await mealApi.updateMeal(editingMeal._id, data)
      
      if (response.success) {
        toast.success('Meal updated successfully!')
        setEditingMeal(null)
        fetchMeals()
      }
    } catch (error) {
      toast.error('Failed to update meal')
    }
  }

  const handleDeleteMeal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meal?')) return
    
    try {
      const response = await mealApi.deleteMeal(id)
      
      if (response.success) {
        toast.success('Meal deleted')
        fetchMeals()
      }
    } catch (error) {
      toast.error('Failed to delete meal')
    }
  }

  const handleToggleFavorite = async (id: string) => {
    try {
      await mealApi.toggleFavorite(id)
      fetchMeals()
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const changeDate = (days: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + days)
    setSelectedDate(format(date, 'yyyy-MM-dd'))
    setPage(1)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Meal Log</h2>
          <p className="text-gray-400 mt-1">Track and manage your daily meals</p>
        </div>
        <button 
          onClick={() => { setEditingMeal(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Meal
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2 glass-card p-2">
          <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-800 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-3">
            <Calendar size={18} className="text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setPage(1); }}
              className="bg-transparent text-white focus:outline-none"
            />
          </div>
          <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-800 rounded-lg">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 glass-card p-2">
          <Filter size={18} className="text-gray-400 ml-2" />
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value as MealType | 'all'); setPage(1); }}
            className="bg-transparent text-white focus:outline-none px-2 py-1"
          >
            <option value="all" className="bg-gray-900">All Types</option>
            <option value="breakfast" className="bg-gray-900">Breakfast</option>
            <option value="lunch" className="bg-gray-900">Lunch</option>
            <option value="dinner" className="bg-gray-900">Dinner</option>
            <option value="snack" className="bg-gray-900">Snack</option>
          </select>
        </div>
      </div>

      {/* Meals List with Virtualization */}
      <VirtualizedMealList
        meals={meals}
        isLoading={isLoading}
        onEdit={(meal) => { setEditingMeal(meal); setIsModalOpen(true); }}
        onDelete={handleDeleteMeal}
        onToggleFavorite={handleToggleFavorite}
        onAddFirst={() => { setEditingMeal(null); setIsModalOpen(true); }}
      />

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 p-4 glass-card">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-ghost disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-ghost disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingMeal(null); }}
        onSubmit={editingMeal ? handleEditMeal : handleAddMeal}
        editMeal={editingMeal}
      />
    </div>
  )
}

export default MealLog

