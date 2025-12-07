/**
 * Profile Page
 * ============
 * User profile management and settings.
 */

import { useState } from 'react'
import { 
  User, 
  Mail, 
  Target, 
  Activity,
  Scale,
  Ruler,
  Calendar,
  Save,
  ChevronDown
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const Profile = () => {
  const { user, updateUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'targets' | 'preferences'>('profile')

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    profile: {
      age: user?.profile?.age || '',
      gender: user?.profile?.gender || '',
      height: user?.profile?.height || '',
      weight: user?.profile?.weight || '',
      activityLevel: user?.profile?.activityLevel || 'moderate',
      goal: user?.profile?.goal || 'maintain',
    },
  })

  const [targetsData, setTargetsData] = useState({
    calories: user?.dailyTargets?.calories || 2000,
    protein: user?.dailyTargets?.protein || 50,
    carbs: user?.dailyTargets?.carbs || 250,
    fat: user?.dailyTargets?.fat || 65,
    fiber: user?.dailyTargets?.fiber || 25,
    water: user?.dailyTargets?.water || 8,
  })

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      const response = await authApi.updateProfile({
        name: profileData.name,
        profile: {
          age: Number(profileData.profile.age) || undefined,
          gender: profileData.profile.gender as 'male' | 'female' | 'other' | 'prefer-not-to-say' || undefined,
          height: Number(profileData.profile.height) || undefined,
          weight: Number(profileData.profile.weight) || undefined,
          activityLevel: profileData.profile.activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
          goal: profileData.profile.goal as 'lose-weight' | 'maintain' | 'gain-weight' | 'build-muscle',
        },
      })

      if (response.success && response.data) {
        updateUser(response.data.user)
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTargetsSave = async () => {
    setIsLoading(true)
    try {
      const response = await authApi.updateTargets(targetsData)

      if (response.success && response.data) {
        updateUser({ dailyTargets: response.data.dailyTargets })
        toast.success('Daily targets updated!')
      }
    } catch (error) {
      toast.error('Failed to update targets')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'targets' as const, label: 'Daily Targets', icon: Target },
    { id: 'preferences' as const, label: 'Preferences', icon: Activity },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-white">Profile Settings</h2>
        <p className="text-gray-400 mt-1">Manage your account and nutrition goals</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
            <p className="text-gray-400 flex items-center gap-2">
              <Mail size={16} />
              {user?.email}
            </p>
            <p className="text-sm text-primary-400 capitalize mt-1">
              Goal: {user?.profile?.goal?.replace('-', ' ') || 'Not set'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-card p-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="input-field pl-12"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="label">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={profileData.profile.age}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      profile: { ...profileData.profile, age: e.target.value }
                    })}
                    className="input-field pl-12"
                    placeholder="25"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="label">Gender</label>
                <div className="relative">
                  <select
                    value={profileData.profile.gender}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      profile: { ...profileData.profile, gender: e.target.value }
                    })}
                    className="input-field appearance-none"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="label">Height (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={profileData.profile.height}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      profile: { ...profileData.profile, height: e.target.value }
                    })}
                    className="input-field pl-12"
                    placeholder="170"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="label">Weight (kg)</label>
                <div className="relative">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={profileData.profile.weight}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      profile: { ...profileData.profile, weight: e.target.value }
                    })}
                    className="input-field pl-12"
                    placeholder="70"
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="label">Activity Level</label>
                <div className="relative">
                  <select
                    value={profileData.profile.activityLevel}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      profile: { ...profileData.profile, activityLevel: e.target.value }
                    })}
                    className="input-field appearance-none"
                  >
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="light">Light (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very-active">Very Active (intense daily)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Goal */}
              <div className="md:col-span-2">
                <label className="label">Fitness Goal</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'lose-weight', label: 'Lose Weight', emoji: '🏃' },
                    { value: 'maintain', label: 'Maintain', emoji: '⚖️' },
                    { value: 'gain-weight', label: 'Gain Weight', emoji: '📈' },
                    { value: 'build-muscle', label: 'Build Muscle', emoji: '💪' },
                  ].map((goal) => (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => setProfileData({
                        ...profileData,
                        profile: { ...profileData.profile, goal: goal.value }
                      })}
                      className={clsx(
                        'p-4 rounded-xl text-center transition-all',
                        profileData.profile.goal === goal.value
                          ? 'bg-primary-500/20 border-2 border-primary-500 text-white'
                          : 'bg-gray-800 border-2 border-transparent text-gray-400 hover:bg-gray-700'
                      )}
                    >
                      <span className="text-2xl mb-2 block">{goal.emoji}</span>
                      <span className="text-sm font-medium">{goal.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleProfileSave}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Targets Tab */}
        {activeTab === 'targets' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Daily Nutrition Targets</h3>
            <p className="text-gray-400 text-sm">
              Set your daily goals. These will be used to track your progress.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: 'calories', label: 'Calories', unit: 'kcal', color: 'text-primary-400' },
                { key: 'protein', label: 'Protein', unit: 'g', color: 'text-orange-400' },
                { key: 'carbs', label: 'Carbohydrates', unit: 'g', color: 'text-blue-400' },
                { key: 'fat', label: 'Fat', unit: 'g', color: 'text-pink-400' },
                { key: 'fiber', label: 'Fiber', unit: 'g', color: 'text-green-400' },
                { key: 'water', label: 'Water', unit: 'glasses', color: 'text-cyan-400' },
              ].map((target) => (
                <div key={target.key} className="bg-gray-800/50 rounded-xl p-4">
                  <label className={clsx('text-sm font-medium', target.color)}>
                    {target.label}
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      value={targetsData[target.key as keyof typeof targetsData]}
                      onChange={(e) => setTargetsData({
                        ...targetsData,
                        [target.key]: Number(e.target.value)
                      })}
                      className="input-field flex-1"
                      min="0"
                    />
                    <span className="text-gray-500 text-sm">{target.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleTargetsSave}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              {isLoading ? 'Saving...' : 'Save Targets'}
            </button>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Dietary Preferences</h3>
            <p className="text-gray-400 text-sm">
              Set your dietary preferences to get personalized meal suggestions.
            </p>
            
            <div className="text-center py-12 text-gray-400">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Dietary preferences settings coming soon!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

