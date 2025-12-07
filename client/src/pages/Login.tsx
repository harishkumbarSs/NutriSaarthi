/**
 * Login Page
 * ==========
 * User authentication form.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(formData)
    if (success) {
      navigate('/dashboard')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-white mb-2">
        Welcome back
      </h2>
      <p className="text-gray-400 mb-8">
        Sign in to continue your nutrition journey
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-12"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field pl-12 pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Register Link */}
      <p className="mt-8 text-center text-gray-400">
        Don't have an account?{' '}
        <Link 
          to="/register" 
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}

export default Login

