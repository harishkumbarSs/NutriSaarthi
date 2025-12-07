import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { Toaster } from 'react-hot-toast'

// Layouts
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'

// Pages
import Dashboard from './pages/Dashboard'
import MealLog from './pages/MealLog'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import WaterTracking from './pages/WaterTracking'
import MealPlanner from './pages/MealPlanner'
import Progress from './pages/Progress'

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

/**
 * Public Route Component
 * Redirects to dashboard if user is already authenticated
 */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meals" element={<MealLog />} />
        <Route path="/water" element={<WaterTracking />} />
        <Route path="/planner" element={<MealPlanner />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </>
  )
}

export default App

