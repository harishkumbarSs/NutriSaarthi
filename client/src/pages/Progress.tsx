/**
 * Progress Tracking Page
 * ======================
 * Track weight, calorie trends, and weekly/monthly reports.
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Target,
  Calendar,
  Award,
  Flame,
  Beef,
  Activity,
  ChevronDown,
} from 'lucide-react'
import { format, subDays, subWeeks, subMonths } from 'date-fns'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { dashboardApi, authApi } from '../services/api'
import { AnimatedContainer, AnimatedItem } from '../components/ui/PageTransition'
import { ChartSkeleton, StatCardSkeleton } from '../components/ui/Skeleton'
import clsx from 'clsx'
import toast from 'react-hot-toast'

interface ProgressStats {
  weight: {
    current: number
    start: number
    change: number
    history: { date: string; weight: number }[]
  }
  calories: {
    average: number
    target: number
    trend: { date: string; consumed: number; target: number }[]
  }
  macros: {
    averageProtein: number
    averageCarbs: number
    averageFat: number
    distribution: { name: string; value: number }[]
  }
  streaks: {
    current: number
    longest: number
    goalsReached: number
  }
}

type TimeRange = '7d' | '14d' | '30d' | '90d'

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '14d', label: '14 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
]

const Progress = () => {
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [newWeight, setNewWeight] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchProgressData = async () => {
    try {
      const response = await dashboardApi.getProgress(timeRange)
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchProgressData()
  }, [timeRange])

  const handleUpdateWeight = async () => {
    const weight = parseFloat(newWeight)
    if (isNaN(weight) || weight <= 0) {
      toast.error('Please enter a valid weight')
      return
    }

    setIsUpdating(true)
    try {
      const response = await authApi.updateProfile({
        profile: { weight },
      })
      if (response.success) {
        toast.success('Weight updated!')
        setNewWeight('')
        fetchProgressData()
      }
    } catch (error) {
      toast.error('Failed to update weight')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    )
  }

  // Mock data if API doesn't return full data
  const mockStats: ProgressStats = stats || {
    weight: {
      current: 72,
      start: 75,
      change: -3,
      history: Array.from({ length: 30 }, (_, i) => ({
        date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
        weight: 75 - (i * 0.1),
      })),
    },
    calories: {
      average: 1850,
      target: 2000,
      trend: Array.from({ length: 30 }, (_, i) => ({
        date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
        consumed: 1700 + Math.random() * 500,
        target: 2000,
      })),
    },
    macros: {
      averageProtein: 82,
      averageCarbs: 220,
      averageFat: 65,
      distribution: [
        { name: 'Protein', value: 25 },
        { name: 'Carbs', value: 50 },
        { name: 'Fat', value: 25 },
      ],
    },
    streaks: {
      current: 7,
      longest: 21,
      goalsReached: 18,
    },
  }

  const { weight, calories, macros, streaks } = mockStats

  return (
    <AnimatedContainer className="space-y-6">
      {/* Header with Time Range */}
      <AnimatedItem>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-primary-400" />
              Progress
            </h2>
            <p className="text-gray-400 mt-1">Track your fitness journey</p>
          </div>

          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10
                       text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {TIME_RANGES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </AnimatedItem>

      {/* Quick Stats */}
      <AnimatedItem>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Current Weight */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Scale className="w-5 h-5 text-blue-400" />
              <span className={clsx(
                'flex items-center gap-1 text-sm font-medium',
                weight.change < 0 ? 'text-green-400' : weight.change > 0 ? 'text-red-400' : 'text-gray-400'
              )}>
                {weight.change < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                {Math.abs(weight.change)} kg
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{weight.current} kg</p>
            <p className="text-sm text-gray-400">Current Weight</p>
          </motion.div>

          {/* Daily Calories */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-gray-400">
                avg {Math.round((calories.average / calories.target) * 100)}%
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{Math.round(calories.average)}</p>
            <p className="text-sm text-gray-400">Avg Daily Calories</p>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">
                Best: {streaks.longest} days
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{streaks.current} days</p>
            <p className="text-sm text-gray-400">Current Streak</p>
          </motion.div>

          {/* Goals Reached */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">
                / {timeRange.replace('d', '')} days
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{streaks.goalsReached}</p>
            <p className="text-sm text-gray-400">Goals Reached</p>
          </motion.div>
        </div>
      </AnimatedItem>

      {/* Weight Trend Chart */}
      <AnimatedItem>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Weight Trend</h3>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Update weight (kg)"
                className="w-40 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                step="0.1"
              />
              <button
                onClick={handleUpdateWeight}
                disabled={isUpdating || !newWeight}
                className="btn-primary py-1.5 px-4 text-sm disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weight.history}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  domain={['dataMin - 2', 'dataMax + 2']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickFormatter={(value) => `${value}kg`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Weight']}
                  labelFormatter={(date) => format(new Date(date), 'EEEE, MMM d')}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#weightGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </AnimatedItem>

      {/* Calorie Trend */}
      <AnimatedItem>
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Calorie Intake Trend</h3>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calories.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: number, name: string) => [
                    `${Math.round(value)} kcal`,
                    name === 'consumed' ? 'Consumed' : 'Target',
                  ]}
                  labelFormatter={(date) => format(new Date(date), 'EEEE, MMM d')}
                />
                <Legend />
                <Bar
                  dataKey="consumed"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="Consumed"
                />
                <Line
                  dataKey="target"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </AnimatedItem>

      {/* Macro Distribution */}
      <AnimatedItem>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Macros */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Beef className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Average Daily Macros</h3>
            </div>

            <div className="space-y-4">
              {/* Protein */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Protein</span>
                  <span className="text-white font-medium">{macros.averageProtein}g</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(macros.averageProtein / 150) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                  />
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Carbohydrates</span>
                  <span className="text-white font-medium">{macros.averageCarbs}g</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(macros.averageCarbs / 300) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  />
                </div>
              </div>

              {/* Fat */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Fat</span>
                  <span className="text-white font-medium">{macros.averageFat}g</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(macros.averageFat / 100) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Activity Summary</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <Calendar className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {parseInt(timeRange)}
                </p>
                <p className="text-xs text-gray-400">Days Tracked</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {Math.round(calories.average * parseInt(timeRange))}
                </p>
                <p className="text-xs text-gray-400">Total Calories</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {Math.round((streaks.goalsReached / parseInt(timeRange)) * 100)}%
                </p>
                <p className="text-xs text-gray-400">Goal Success Rate</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {weight.change < 0 ? 'Loss' : weight.change > 0 ? 'Gain' : 'Maintained'}
                </p>
                <p className="text-xs text-gray-400">Weight Trend</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedItem>
    </AnimatedContainer>
  )
}

export default Progress

