import { useState, useEffect } from 'react'
import { Droplet, Plus, Minus, AlertCircle } from 'lucide-react'
import api from '../services/api'

export default function WaterTracker() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [waterAmount, setWaterAmount] = useState(250)
  const [isLogging, setIsLogging] = useState(false)

  useEffect(() => {
    fetchWaterStatus()
  }, [])

  const fetchWaterStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/water/status')
      setStatus(res.data)
    } catch (err) {
      console.error('Error fetching water status:', err)
      setError('Failed to load water tracking data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogWater = async () => {
    if (waterAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setIsLogging(true)
      setError(null)
      
      await api.post('/water', {
        water_ml: waterAmount,
        date: new Date().toISOString().split('T')[0]
      })

      // Refresh status
      await fetchWaterStatus()
      setWaterAmount(250) // Reset input
    } catch (err) {
      console.error('Error logging water:', err)
      setError('Failed to log water intake')
    } finally {
      setIsLogging(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">💧 Water Tracker</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading water tracking data...</div>
        </div>
      </div>
    )
  }

  const getGoalColor = (percentage) => {
    if (percentage < 25) return 'from-red-400 to-red-300'
    if (percentage < 50) return 'from-orange-400 to-orange-300'
    if (percentage < 75) return 'from-yellow-400 to-yellow-300'
    if (percentage < 100) return 'from-lime-400 to-lime-300'
    return 'from-green-400 to-green-300'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">💧 Smart Water Tracker</h1>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {status && (
        <>
          {/* Goal Recommendation Callout */}
          <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <div className="flex items-start">
              <Droplet className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Personalized Hydration Goal</h3>
                <p className="text-blue-800">
                  Based on your activity level and climate, we recommend drinking{' '}
                  <span className="font-bold text-lg">{status.dynamic_goal_ml}ml</span> of water daily.
                  <br />
                  <span className="text-sm text-blue-700 mt-2 block">
                    Standard goal: {status.fixed_goal_ml}ml • Your personalized goal: {status.dynamic_goal_ml}ml
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Fixed Goal Progress */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Standard Goal</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-800">
                    {status.current_water_ml}ml
                  </span>
                  <span className="text-lg text-gray-600">
                    {status.percentage_fixed.toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Goal: {status.fixed_goal_ml}ml</p>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${getGoalColor(status.percentage_fixed)} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(status.percentage_fixed, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Dynamic Goal Progress */}
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-orange-300 bg-orange-50">
              <h3 className="text-lg font-semibold mb-4 text-orange-900">🎯 Personalized Goal</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-2xl font-bold text-orange-800">
                    {status.current_water_ml}ml
                  </span>
                  <span className="text-lg text-orange-700">
                    {status.percentage_dynamic.toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-orange-700 mb-3 font-semibold">Goal: {status.dynamic_goal_ml}ml</p>
                <div className="bg-orange-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${getGoalColor(status.percentage_dynamic)} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(status.percentage_dynamic, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="mb-8 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-lg p-6">
            <p className="text-center text-lg font-semibold text-blue-900">
              {status.recommendation}
            </p>
          </div>

          {/* Water Logging Section */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Log Water Intake</h2>

            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setWaterAmount(Math.max(0, waterAmount - 250))}
                className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                title="Decrease by 250ml"
              >
                <Minus className="w-6 h-6" />
              </button>

              <div className="flex-1">
                <input
                  type="number"
                  value={waterAmount}
                  onChange={(e) => setWaterAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter amount in ml"
                  min="0"
                />
                <p className="text-center text-sm text-gray-600 mt-2">milliliters (ml)</p>
              </div>

              <button
                onClick={() => setWaterAmount(waterAmount + 250)}
                className="p-3 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                title="Increase by 250ml"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {/* Quick add buttons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <button
                onClick={() => setWaterAmount(250)}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                250ml
              </button>
              <button
                onClick={() => setWaterAmount(500)}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                500ml
              </button>
              <button
                onClick={() => setWaterAmount(750)}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                750ml
              </button>
              <button
                onClick={() => setWaterAmount(1000)}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                1L
              </button>
            </div>

            <button
              onClick={handleLogWater}
              disabled={isLogging}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Droplet className="w-5 h-5" />
              {isLogging ? 'Logging...' : 'Log Water Intake'}
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">💡 How It Works</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">1.</span>
                <span><strong>Fixed Goal:</strong> Based on your body weight (30ml × weight in kg)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">2.</span>
                <span><strong>Personalized Goal:</strong> Adjusted for your activity level and climate</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">3.</span>
                <span><strong>Activity Boost:</strong> More water needed for active lifestyles</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">4.</span>
                <span><strong>Climate Adjustment:</strong> Tropical climates increase hydration needs</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
