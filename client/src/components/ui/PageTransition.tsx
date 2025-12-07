/**
 * Page Transition Component
 * =========================
 * Smooth page transitions using Framer Motion.
 * Provides fade, slide, and scale animations.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
}

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 200,
    },
  },
}

// Fade in animation for individual elements
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.4 }
  },
  exit: { opacity: 0 },
}

// Slide up animation
export const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    }
  },
  exit: { opacity: 0, y: -20 },
}

// Scale animation for modals/cards
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    }
  },
  exit: { opacity: 0, scale: 0.95 },
}

// Page transition wrapper
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Animated container for staggered children
export const AnimatedContainer = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    animate="show"
    className={className}
  >
    {children}
  </motion.div>
)

// Animated item for use inside AnimatedContainer
export const AnimatedItem = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) => (
  <motion.div variants={staggerItem} className={className}>
    {children}
  </motion.div>
)

// Button with hover/tap animations
export const AnimatedButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={className}
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  >
    {children}
  </motion.button>
)

// Card with hover animation
export const AnimatedCard = ({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => (
  <motion.div
    className={className}
    onClick={onClick}
    whileHover={{ 
      y: -4,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  >
    {children}
  </motion.div>
)

// Progress ring with animation
export const AnimatedProgressRing = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = '#22c55e',
}: {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-800"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
    </svg>
  )
}

// Number counter animation
export const AnimatedCounter = ({
  value,
  duration = 1,
  className = '',
}: {
  value: number
  duration?: number
  className?: string
}) => (
  <motion.span
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    key={value}
  >
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {value}
    </motion.span>
  </motion.span>
)

export default PageTransition

