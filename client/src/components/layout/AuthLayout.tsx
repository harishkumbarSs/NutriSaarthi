import { Outlet } from 'react-router-dom'

/**
 * AuthLayout Component
 * ====================
 * Layout for authentication pages (login, register).
 * Features a centered form with decorative background.
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/10 rounded-2xl mb-4">
            <img src="/logo.svg" alt="NutriSaarthi" className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient">
            NutriSaarthi
          </h1>
          <p className="text-gray-400 mt-2">Your Intelligent Nutrition Companion</p>
        </div>

        {/* Form Container */}
        <div className="glass-card p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2024 NutriSaarthi. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout

