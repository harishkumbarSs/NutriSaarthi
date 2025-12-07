/**
 * Register Page
 * =============
 * New user registration form.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })

    if (success) {
      navigate('/dashboard')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-white mb-2">
        Create your account
      </h2>
      <p className="text-gray-400 mb-8">
        Start your journey to better nutrition
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="label">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field pl-12"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

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
              minLength={6}
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

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="label">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field pl-12"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

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
              Create Account
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-8 text-center text-gray-400">
        Already have an account?{' '}
        <Link 
          to="/login" 
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default Register

