/**
 * Theme Toggle Component
 * ======================
 * Switches between light and dark themes with smooth animation.
 */

import { useThemeStore } from '../../stores/themeStore';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle = ({ className = '', showLabel = false }: ThemeToggleProps) => {
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`group flex items-center gap-3 ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div
        className={`
          relative w-14 h-7 rounded-full transition-colors duration-300 ease-in-out
          ${isDark 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
            : 'bg-gradient-to-r from-amber-400 to-orange-400'
          }
          shadow-inner
        `}
      >
        {/* Sun and Moon icons container */}
        <div className="absolute inset-0 flex items-center justify-between px-1.5">
          {/* Sun icon */}
          <svg
            className={`w-4 h-4 transition-opacity duration-300 ${isDark ? 'opacity-50' : 'opacity-100'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          
          {/* Moon icon */}
          <svg
            className={`w-4 h-4 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-50'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </div>

        {/* Toggle thumb */}
        <div
          className={`
            absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg
            transform transition-transform duration-300 ease-in-out
            ${isDark ? 'translate-x-7' : 'translate-x-0.5'}
            flex items-center justify-center
          `}
        >
          {/* Inner icon on thumb */}
          {isDark ? (
            <svg className="w-3.5 h-3.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {showLabel && (
        <span className="text-sm font-medium text-theme-secondary group-hover:text-theme-primary transition-colors">
          {isDark ? 'Dark' : 'Light'} Mode
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;

