import { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, Droplet, Zap } from 'lucide-react'
import api from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [tip, setTip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshingTip, setRefreshingTip] = useState(false)

  // Fetch dashboard stats and coaching tip
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch stats
      const statsRes = await api.get('/dashboard/stats')
      setStats(statsRes.data)

      // Fetch coaching tip
      const tipRes = await api.get('/dashboard/tip')
      setTip(tipRes.data)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshTip = async () => {
    try {
      setRefreshingTip(true)
      const tipRes = await api.get('/dashboard/tip')
      setTip(tipRes.data)
    } catch (err) {
      console.error('Error refreshing tip:', err)
    } finally {
      setRefreshingTip(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">🍜 Your Nutrition Dashboard</h1>

      {/* AI Coaching Tip - Prominent Display */}
      {tip && (
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Zap className="w-6 h-6 text-orange-500 mr-2" />
                <h2 className="text-2xl font-bold text-orange-900">AI Coaching Tip</h2>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-3 leading-relaxed">
                {tip.tip}
              </p>
              <p className="text-sm text-gray-600 italic">
                Based on your latest meal: <span className="font-medium">{tip.meal_context}</span>
              </p>
            </div>
            <button
              onClick={handleRefreshTip}
              disabled={refreshingTip}
              className="ml-4 p-2 hover:bg-orange-200 rounded-lg transition-colors disabled:opacity-50"
              title="Get a new tip"
            >
              <RefreshCw className={`w-6 h-6 text-orange-600 ${refreshingTip ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Calories */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Calories</h3>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {stats?.today_calories?.toFixed(0) || 0}
          </div>
          <p className="text-sm text-gray-600">Goal: {stats?.calorie_goal?.toFixed(0) || 0} cal</p>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(
                  ((stats?.today_calories || 0) / (stats?.calorie_goal || 1)) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Protein */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Protein</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {stats?.today_protein?.toFixed(1) || 0}g
          </div>
          <p className="text-sm text-gray-600">Daily macronutrient</p>
        </div>

        {/* Carbs */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Carbs</h3>
            <TrendingUp className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {stats?.today_carbs?.toFixed(1) || 0}g
          </div>
          <p className="text-sm text-gray-600">Daily macronutrient</p>
        </div>

        {/* Water */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Water</h3>
            <Droplet className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {stats?.today_water_ml || 0}ml
          </div>
          <p className="text-sm text-gray-600">Goal: {stats?.water_goal_ml || 0}ml</p>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(
                  ((stats?.today_water_ml || 0) / (stats?.water_goal_ml || 1)) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Weekly Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">📊 Weekly Overview</h2>
        <div className="flex items-end justify-between h-48 gap-2">
          {stats?.weekly_dates?.map((date, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="relative w-full flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-orange-400 to-orange-300 rounded-t transition-all hover:opacity-80"
                  style={{
                    height: `${Math.max(
                      (stats.weekly_calories[idx] / (stats.calorie_goal || 2000)) * 150,
                      10
                    )}px`,
                  }}
                  title={`${stats.weekly_calories[idx]} cal`}
                ></div>
                <p className="text-xs text-gray-600 mt-2">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
