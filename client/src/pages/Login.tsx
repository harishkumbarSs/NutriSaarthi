/**
 * Login Page
 * ==========
 * User authentication form with react-hook-form and zod validation.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../stores/authStore'
import { loginSchema, LoginFormData } from '../lib/validations'
import { InputField, SubmitButton } from '../components/ui/FormField'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data)
    if (success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-theme-primary mb-2">
        Welcome back
      </h2>
      <p className="text-theme-secondary mb-8">
        Sign in to continue your nutrition journey
      </p>

      {/* API Error Display */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-500 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary z-10" />
            <input
              {...register('email')}
              type="email"
              id="email"
              className={`input-field pl-12 ${errors.email ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary z-10" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className={`input-field pl-12 pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-tertiary hover:text-theme-primary transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <SubmitButton isLoading={isLoading} loadingText="Signing in...">
          Sign In
          <ArrowRight size={18} />
        </SubmitButton>
      </form>

      {/* Register Link */}
      <p className="mt-8 text-center text-theme-secondary">
        Don't have an account?{' '}
        <Link 
          to="/register" 
          className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}

export default Login
