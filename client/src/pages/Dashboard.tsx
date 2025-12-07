/**
 * Dashboard Page
 * ==============
 * Main dashboard with nutrition overview and analytics.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Flame, 
  Beef, 
  Wheat, 
  Droplets,
  TrendingUp,
  Plus,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react'
import { dashboardApi, recommendationApi } from '../services/api'
import { DashboardData, Recommendation } from '../types'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import clsx from 'clsx'

// Progress Ring Component
const ProgressRing = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 10,
  color = 'primary'
}: { 
  percentage: number
  size?: number
  strokeWidth?: number
  color?: 'primary' | 'orange' | 'blue' | 'pink'
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference

  const colors = {
    primary: 'stroke-primary-500',
    orange: 'stroke-orange-500',
    blue: 'stroke-blue-500',
    pink: 'stroke-pink-500',
  }

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-800"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={clsx(colors[color], 'transition-all duration-1000 ease-out')}
      />
    </svg>
  )
}

// Stat Card Component
const StatCard = ({
  icon: Icon,
  label,
  value,
  target,
  unit,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number
  target: number
  unit: string
  color: 'primary' | 'orange' | 'blue' | 'pink'
}) => {
  const percentage = Math.round((value / target) * 100)
  
  const bgColors = {
    primary: 'bg-primary-500/10',
    orange: 'bg-orange-500/10',
    blue: 'bg-blue-500/10',
    pink: 'bg-pink-500/10',
  }

  const textColors = {
    primary: 'text-primary-400',
    orange: 'text-orange-400',
    blue: 'text-blue-400',
    pink: 'text-pink-400',
  }

  return (
    <div className="glass-card p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('p-3 rounded-xl', bgColors[color])}>
          <Icon className={clsx('w-6 h-6', textColors[color])} />
        </div>
        <span className={clsx('text-sm font-medium', textColors[color])}>
          {percentage}%
        </span>
      </div>
      
      <div className="mb-4">
        <h3 className="text-gray-400 text-sm mb-1">{label}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-gray-500">/ {target} {unit}</span>
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className={clsx('progress-fill', {
            'bg-primary-500': color === 'primary',
            'bg-orange-500': color === 'orange',
            'bg-blue-500': color === 'blue',
            'bg-pink-500': color === 'pink',
          })}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, recsRes] = await Promise.all([
          dashboardApi.getDashboard(),
          recommendationApi.getRecommendations(),
        ])

        if (dashboardRes.success && dashboardRes.data) {
          setData(dashboardRes.data)
        }
        if (recsRes.success && recsRes.data) {
          setRecommendations(recsRes.data.recommendations.slice(0, 3))
        }
      } catch (error) {
        console.error('Failed to fetch dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Failed to load dashboard data.</p>
      </div>
    )
  }

  const { today, weeklyChart, recentMeals } = data

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! 👋
          </h2>
          <p className="text-gray-400 mt-1">
            Here's your nutrition summary for today
          </p>
        </div>
        <Link to="/meals" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Log Meal
        </Link>
      </div>

      {/* Main Calorie Card */}
      <div className="glass-card p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Progress Ring */}
          <div className="relative">
            <ProgressRing percentage={today.calories.percentage} size={180} strokeWidth={14} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Flame className="w-8 h-8 text-primary-400 mb-1" />
              <span className="text-3xl font-bold text-white">{today.calories.consumed}</span>
              <span className="text-sm text-gray-400">kcal</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <p className="text-gray-400 text-sm mb-1">Target</p>
              <p className="text-xl font-bold text-white">{today.calories.target}</p>
            </div>
            <div className="text-center p-4">
              <p className="text-gray-400 text-sm mb-1">Consumed</p>
              <p className="text-xl font-bold text-primary-400">{today.calories.consumed}</p>
            </div>
            <div className="text-center p-4">
              <p className="text-gray-400 text-sm mb-1">Remaining</p>
              <p className="text-xl font-bold text-white">{today.calories.remaining}</p>
            </div>
            <div className="text-center p-4">
              <p className="text-gray-400 text-sm mb-1">Meals</p>
              <p className="text-xl font-bold text-white">{today.mealCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Beef}
          label="Protein"
          value={today.protein.consumed}
          target={today.protein.target}
          unit="g"
          color="orange"
        />
        <StatCard
          icon={Wheat}
          label="Carbohydrates"
          value={today.carbs.consumed}
          target={today.carbs.target}
          unit="g"
          color="blue"
        />
        <StatCard
          icon={Droplets}
          label="Fat"
          value={today.fat.consumed}
          target={today.fat.target}
          unit="g"
          color="pink"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              <h3 className="font-semibold text-white">Weekly Calories</h3>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChart}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
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
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                />
                <Bar 
                  dataKey="calories" 
                  fill="#22c55e" 
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent-400" />
            <h3 className="font-semibold text-white">AI Recommendations</h3>
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl"
                >
                  <span className="text-2xl">{rec.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{rec.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">{rec.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Log more meals to get personalized recommendations!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Meals */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-primary-400" />
            <h3 className="font-semibold text-white">Recent Meals</h3>
          </div>
          <Link to="/meals" className="text-primary-400 text-sm hover:underline">
            View all
          </Link>
        </div>

        {recentMeals.length > 0 ? (
          <div className="space-y-3">
            {recentMeals.map((meal) => (
              <div 
                key={meal._id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{meal.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{meal.mealType}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(meal.consumedAt).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No meals logged today.</p>
            <Link to="/meals" className="btn-primary mt-4 inline-flex items-center gap-2">
              <Plus size={18} />
              Log your first meal
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

