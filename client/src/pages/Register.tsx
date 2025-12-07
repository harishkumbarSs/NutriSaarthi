/**
 * Register Page
 * =============
 * New user registration form with react-hook-form and zod validation.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../stores/authStore'
import { registerSchema, RegisterFormData } from '../lib/validations'
import { SubmitButton } from '../components/ui/FormField'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error: apiError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    })

    if (success) {
      navigate('/dashboard')
    }
  }

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: '' }
    let strength = 0
    if (pwd.length >= 6) strength++
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[a-z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++

    if (strength <= 2) return { strength: 33, label: 'Weak', color: 'bg-red-500' }
    if (strength <= 4) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' }
    return { strength: 100, label: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-theme-primary mb-2">
        Create your account
      </h2>
      <p className="text-theme-secondary mb-8">
        Start your journey to better nutrition
      </p>

      {/* API Error Display */}
      {apiError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-500 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {apiError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="label">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary z-10" />
            <input
              {...register('name')}
              type="text"
              id="name"
              className={`input-field pl-12 ${errors.name ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name.message}
            </p>
          )}
        </div>

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
          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-theme-tertiary">Password strength</span>
                <span className={`text-xs font-medium ${
                  passwordStrength.label === 'Weak' ? 'text-red-500' :
                  passwordStrength.label === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-1.5 bg-theme-tertiary/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="label">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary z-10" />
            <input
              {...register('confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              className={`input-field pl-12 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}`}
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <SubmitButton isLoading={isLoading} loadingText="Creating account...">
          Create Account
          <ArrowRight size={18} />
        </SubmitButton>
      </form>

      {/* Login Link */}
      <p className="mt-8 text-center text-theme-secondary">
        Already have an account?{' '}
        <Link 
          to="/login" 
          className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default Register
