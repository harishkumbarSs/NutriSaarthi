import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

/**
 * Navbar Component
 * ================
 * Top navigation bar with search, notifications, and user info.
 */

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your nutrition overview' },
  '/meals': { title: 'Meal Log', subtitle: 'Track your daily meals' },
  '/profile': { title: 'Profile', subtitle: 'Manage your account' },
}

const Navbar = () => {
  const location = useLocation()
  const { user } = useAuthStore()
  
  const currentPage = pageTitles[location.pathname] || { 
    title: 'NutriSaarthi', 
    subtitle: 'Welcome back!' 
  }

  // Get current date in a nice format
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Page Title & Date */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-display font-bold text-white truncate">
              {currentPage.title}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {today}
            </p>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search (Desktop only) */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search meals..."
                  className="w-48 lg:w-64 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                           pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                           transition-all duration-200"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 bg-gray-800/50 hover:bg-gray-800 rounded-xl 
                             text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              {/* Notification Badge */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
            </button>

            {/* User Avatar (Mobile) */}
            <div className="lg:hidden w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-400">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

