/**
 * Meal Log Page
 * =============
 * View and manage meal entries with add/edit functionality.
 */

import { useEffect, useState, useCallback } from 'react'
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
  ChevronRight
} from 'lucide-react'
import { mealApi } from '../services/api'
import { Meal, MealType, MealFormData } from '../types'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

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

  useEffect(() => {
    if (editMeal) {
      setFormData({
        name: editMeal.name,
        description: editMeal.description,
        mealType: editMeal.mealType,
        nutrition: editMeal.nutrition,
        notes: editMeal.notes,
      })
    } else {
      setFormData({
        name: '',
        mealType: 'breakfast',
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      })
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
          {/* Meal Name */}
          <div>
            <label className="label">Meal Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g., Grilled Chicken Salad"
              required
            />
          </div>

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

      {/* Meals List */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-16">
            <UtensilsCrossed className="w-16 h-16 mx-auto text-gray-700 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No meals found</h3>
            <p className="text-gray-500 mb-6">Start tracking your nutrition journey!</p>
            <button 
              onClick={() => { setEditingMeal(null); setIsModalOpen(true); }}
              className="btn-primary"
            >
              Add your first meal
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {meals.map((meal) => (
              <div 
                key={meal._id}
                className="p-4 sm:p-6 hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                      <UtensilsCrossed className="w-6 h-6 text-primary-400" />
                    </div>
                    
                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white">{meal.name}</h3>
                        <MealTypeBadge type={meal.mealType} />
                      </div>
                      
                      <p className="text-sm text-gray-400 mt-1">
                        {format(new Date(meal.consumedAt), 'h:mm a')}
                      </p>
                      
                      {/* Nutrition Quick View */}
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-primary-400">{meal.nutrition.calories} kcal</span>
                        <span className="text-gray-500">P: {meal.nutrition.protein}g</span>
                        <span className="text-gray-500">C: {meal.nutrition.carbs}g</span>
                        <span className="text-gray-500">F: {meal.nutrition.fat}g</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFavorite(meal._id)}
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
                      onClick={() => { setEditingMeal(meal); setIsModalOpen(true); }}
                      className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteMeal(meal._id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-800">
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
      </div>

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

