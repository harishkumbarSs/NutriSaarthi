/**
 * Skeleton Loading Components
 * ===========================
 * Beautiful skeleton placeholders for loading states.
 * Uses shimmer animation for visual feedback.
 */

import clsx from 'clsx'

// Base skeleton with shimmer effect
export const Skeleton = ({
  className = '',
  variant = 'rectangular',
}: {
  className?: string
  variant?: 'rectangular' | 'circular' | 'text'
}) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800',
        'bg-[length:200%_100%] animate-shimmer',
        {
          'rounded-lg': variant === 'rectangular',
          'rounded-full': variant === 'circular',
          'rounded h-4': variant === 'text',
        },
        className
      )}
    />
  )
}

// Skeleton for stat cards
export const StatCardSkeleton = () => (
  <div className="glass-card p-6 animate-fade-in">
    <div className="flex items-start justify-between mb-4">
      <Skeleton className="w-12 h-12" variant="rectangular" />
      <Skeleton className="w-10 h-5" variant="text" />
    </div>
    <div className="mb-4">
      <Skeleton className="w-20 h-4 mb-2" variant="text" />
      <Skeleton className="w-32 h-8" variant="text" />
    </div>
    <Skeleton className="w-full h-2" variant="rectangular" />
  </div>
)

// Skeleton for meal list items
export const MealItemSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl animate-pulse">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10" variant="rectangular" />
      <div>
        <Skeleton className="w-32 h-4 mb-2" variant="text" />
        <Skeleton className="w-20 h-3" variant="text" />
      </div>
    </div>
    <Skeleton className="w-16 h-4" variant="text" />
  </div>
)

// Skeleton for chart area
export const ChartSkeleton = () => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5" variant="circular" />
        <Skeleton className="w-32 h-5" variant="text" />
      </div>
    </div>
    <div className="h-64 flex items-end gap-2">
      {[...Array(7)].map((_, i) => (
        <Skeleton 
          key={i}
          className="flex-1" 
          style={{ height: `${40 + Math.random() * 50}%` }}
          variant="rectangular"
        />
      ))}
    </div>
  </div>
)

// Skeleton for dashboard main card
export const DashboardCardSkeleton = () => (
  <div className="glass-card p-8">
    <div className="flex flex-col lg:flex-row items-center gap-8">
      <Skeleton className="w-[180px] h-[180px]" variant="circular" />
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center p-4">
            <Skeleton className="w-16 h-3 mx-auto mb-2" variant="text" />
            <Skeleton className="w-20 h-6 mx-auto" variant="text" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Skeleton for profile form
export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="glass-card p-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-20 h-20" variant="circular" />
        <div>
          <Skeleton className="w-32 h-5 mb-2" variant="text" />
          <Skeleton className="w-48 h-4" variant="text" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <Skeleton className="w-20 h-4 mb-2" variant="text" />
            <Skeleton className="w-full h-12" variant="rectangular" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Skeleton for water intake card
export const WaterCardSkeleton = () => (
  <div className="glass-card p-6">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="w-5 h-5" variant="circular" />
      <Skeleton className="w-24 h-5" variant="text" />
    </div>
    <div className="flex items-center justify-center gap-4 py-8">
      <Skeleton className="w-12 h-12" variant="circular" />
      <div className="text-center">
        <Skeleton className="w-20 h-10 mx-auto mb-2" variant="text" />
        <Skeleton className="w-32 h-4 mx-auto" variant="text" />
      </div>
      <Skeleton className="w-12 h-12" variant="circular" />
    </div>
  </div>
)

// Full dashboard skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-fade-in">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="w-48 h-8 mb-2" variant="text" />
        <Skeleton className="w-64 h-4" variant="text" />
      </div>
      <Skeleton className="w-28 h-10" variant="rectangular" />
    </div>
    
    {/* Main card */}
    <DashboardCardSkeleton />
    
    {/* Stat cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
    
    {/* Two column */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton />
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="w-5 h-5" variant="circular" />
          <Skeleton className="w-40 h-5" variant="text" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl">
              <Skeleton className="w-8 h-8" variant="rectangular" />
              <div className="flex-1">
                <Skeleton className="w-40 h-4 mb-2" variant="text" />
                <Skeleton className="w-full h-3" variant="text" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default Skeleton

