/**
 * Water Tracking Page
 * ===================
 * Track daily water intake with visual feedback and history.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Droplets, 
  Plus, 
  Minus, 
  Target, 
  TrendingUp,
  Calendar,
  Award,
  Waves
} from 'lucide-react'
import { format, subDays, startOfDay } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { waterApi } from '../services/api'
import { AnimatedContainer, AnimatedItem, AnimatedButton } from '../components/ui/PageTransition'
import { WaterCardSkeleton } from '../components/ui/Skeleton'
import clsx from 'clsx'
import toast from 'react-hot-toast'

interface WaterEntry {
  _id: string
  amount: number
  date: string
  time: string
  createdAt: string
}

interface WaterStats {
  today: {
    total: number
    target: number
    entries: WaterEntry[]
    percentage: number
  }
  weekly: {
    date: string
    amount: number
    target: number
  }[]
  streak: number
}

// Glass amounts for quick add
const GLASS_SIZES = [
  { label: 'Small', amount: 150, icon: '🥛' },
  { label: 'Medium', amount: 250, icon: '🥤' },
  { label: 'Large', amount: 500, icon: '🍶' },
  { label: 'Bottle', amount: 750, icon: '🧴' },
]

// Water drop animation component
const WaterDrop = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-3 h-4 bg-blue-400/60 rounded-full"
    initial={{ y: -20, opacity: 0, scale: 0 }}
    animate={{ 
      y: [0, 100],
      opacity: [0.8, 0],
      scale: [1, 0.5],
    }}
    transition={{
      duration: 1.5,
      delay,
      repeat: Infinity,
      repeatDelay: 2,
    }}
  />
)

const WaterTracking = () => {
  const [stats, setStats] = useState<WaterStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [customAmount, setCustomAmount] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const fetchWaterData = async () => {
    try {
      const response = await waterApi.getToday()
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch water data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWaterData()
  }, [])

  const handleAddWater = async (amount: number) => {
    if (amount <= 0 || isAdding) return
    
    setIsAdding(true)
    try {
      const response = await waterApi.add({ amount })
      if (response.success) {
        toast.success(`Added ${amount}ml of water! 💧`)
        fetchWaterData()
      }
    } catch (error) {
      toast.error('Failed to log water intake')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveWater = async (entryId: string) => {
    try {
      const response = await waterApi.delete(entryId)
      if (response.success) {
        toast.success('Entry removed')
        fetchWaterData()
      }
    } catch (error) {
      toast.error('Failed to remove entry')
    }
  }

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount)
    if (amount > 0) {
      handleAddWater(amount)
      setCustomAmount('')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <WaterCardSkeleton />
        <WaterCardSkeleton />
      </div>
    )
  }

  const today = stats?.today || { total: 0, target: 2000, entries: [], percentage: 0 }
  const weekly = stats?.weekly || []
  const streak = stats?.streak || 0

  return (
    <AnimatedContainer className="space-y-6">
      {/* Header */}
      <AnimatedItem>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <Droplets className="w-7 h-7 text-blue-400" />
              Water Tracking
            </h2>
            <p className="text-gray-400 mt-1">Stay hydrated throughout the day</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">{streak} day streak!</span>
            </div>
          )}
        </div>
      </AnimatedItem>

      {/* Main Progress Card */}
      <AnimatedItem>
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Animated water background */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <Waves className="absolute bottom-0 left-0 w-full h-32 text-blue-500" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            {/* Water Level Visual */}
            <div className="relative w-48 h-64">
              <div className="absolute inset-0 border-4 border-blue-500/30 rounded-3xl overflow-hidden bg-gray-900/50">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.min(today.percentage, 100)}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                {/* Wave effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-4 bg-blue-300/30"
                  style={{ bottom: `${Math.min(today.percentage, 100)}%` }}
                  animate={{ 
                    scaleX: [1, 1.1, 1],
                    y: [-2, 2, -2],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="w-10 h-10 text-white mb-2" />
                <span className="text-3xl font-bold text-white">{today.total}</span>
                <span className="text-sm text-blue-200">ml</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 text-center lg:text-left">
              <div className="text-5xl font-bold text-white mb-2">
                {today.percentage}%
              </div>
              <p className="text-gray-400 mb-6">
                {today.total} / {today.target}ml daily goal
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-500/10 rounded-xl p-4">
                  <Target className="w-5 h-5 text-blue-400 mx-auto lg:mx-0 mb-2" />
                  <p className="text-2xl font-bold text-white">{today.target}</p>
                  <p className="text-xs text-gray-400">Target (ml)</p>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4">
                  <Droplets className="w-5 h-5 text-green-400 mx-auto lg:mx-0 mb-2" />
                  <p className="text-2xl font-bold text-white">{today.total}</p>
                  <p className="text-xs text-gray-400">Consumed</p>
                </div>
                <div className="bg-orange-500/10 rounded-xl p-4">
                  <TrendingUp className="w-5 h-5 text-orange-400 mx-auto lg:mx-0 mb-2" />
                  <p className="text-2xl font-bold text-white">{Math.max(0, today.target - today.total)}</p>
                  <p className="text-xs text-gray-400">Remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedItem>

      {/* Quick Add Buttons */}
      <AnimatedItem>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-400" />
            Quick Add
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {GLASS_SIZES.map((size) => (
              <AnimatedButton
                key={size.label}
                onClick={() => handleAddWater(size.amount)}
                disabled={isAdding}
                className={clsx(
                  'flex flex-col items-center gap-2 p-4 rounded-xl',
                  'bg-gray-800/50 hover:bg-blue-500/20 border border-gray-700',
                  'hover:border-blue-500/50 transition-all duration-200',
                  isAdding && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span className="text-3xl">{size.icon}</span>
                <span className="text-white font-medium">{size.label}</span>
                <span className="text-sm text-gray-400">{size.amount}ml</span>
              </AnimatedButton>
            ))}
          </div>

          {/* Custom amount input */}
          <div className="flex gap-4">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Custom amount (ml)"
              className="input-field flex-1"
              min="0"
              max="2000"
            />
            <AnimatedButton
              onClick={handleCustomAdd}
              disabled={!customAmount || isAdding}
              className="btn-primary"
            >
              Add
            </AnimatedButton>
          </div>
        </div>
      </AnimatedItem>

      {/* Weekly Chart */}
      <AnimatedItem>
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Weekly Progress</h3>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'EEE')}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`${value}ml`, 'Water']}
                  labelFormatter={(date) => format(new Date(date), 'EEEE, MMM d')}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {weekly.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.amount >= entry.target ? '#22c55e' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </AnimatedItem>

      {/* Today's Entries */}
      <AnimatedItem>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-400" />
              Today's Log
            </h3>
            <span className="text-sm text-gray-400">
              {today.entries.length} entries
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {today.entries.length > 0 ? (
              <motion.div className="space-y-2">
                {today.entries.map((entry) => (
                  <motion.div
                    key={entry._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{entry.amount}ml</p>
                        <p className="text-xs text-gray-400">{entry.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveWater(entry._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <Droplets className="w-16 h-16 mx-auto text-gray-700 mb-4" />
                <p className="text-gray-400">No water logged yet today</p>
                <p className="text-sm text-gray-500 mt-1">
                  Use the quick add buttons above to start tracking!
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </AnimatedItem>
    </AnimatedContainer>
  )
}

export default WaterTracking

