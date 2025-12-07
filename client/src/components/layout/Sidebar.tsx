import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  User, 
  LogOut,
  Sparkles,
  X
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

/**
 * Sidebar Component
 * =================
 * Main navigation sidebar with links to different sections.
 * Responsive: Hidden on mobile, shown on desktop.
 */

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/meals', label: 'Meal Log', icon: <UtensilsCrossed size={20} /> },
  { path: '/profile', label: 'Profile', icon: <User size={20} /> },
]

const Sidebar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
            <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-gradient">NutriSaarthi</h1>
            <p className="text-xs text-gray-500">Nutrition Companion</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-primary-500/10 text-primary-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              )
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* AI Recommendations Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-xl p-4 border border-primary-500/20">
          <div className="flex items-center gap-2 text-primary-400 mb-2">
            <Sparkles size={18} />
            <span className="font-medium text-sm">AI Insights</span>
          </div>
          <p className="text-xs text-gray-400">
            Get personalized nutrition recommendations based on your goals.
          </p>
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-400">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                     text-gray-400 hover:text-red-400 hover:bg-red-500/10
                     transition-all duration-200"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 
                        bg-gray-900/50 backdrop-blur-xl border-r border-gray-800/50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900 flex flex-col animate-slide-up">
            {/* Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Mobile Menu Button - Exposed via window for Navbar */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 p-4 bg-primary-600 rounded-full shadow-lg
                   shadow-primary-500/25 hover:bg-primary-500 transition-colors"
        aria-label="Open menu"
      >
        <LayoutDashboard size={24} />
      </button>
    </>
  )
}

export default Sidebar

