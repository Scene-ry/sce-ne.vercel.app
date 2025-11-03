/**
 * Centralized theme color configuration
 * All color values used throughout the application
 */

export const theme = {
  colors: {
    // Primary brand colors
    primary: {
      light: 'blue-400',
      DEFAULT: 'blue-600',
      dark: 'blue-700',
    },

    // Accent colors for specific elements
    accent: {
      light: 'purple-600',
      DEFAULT: 'purple-600',
    },

    // Status and state colors
    success: {
      DEFAULT: 'green-600',
      dark: 'green-700',
    },

    error: {
      light: 'red-100',
      DEFAULT: 'red-700',
      dark: 'red-900',
    },

    // Background colors for badges and highlights
    badge: {
      light: {
        bg: 'blue-100',
        text: 'blue-800',
      },
      dark: {
        bg: 'blue-900',
        text: 'blue-200',
      },
    },

    // Interactive element states
    interactive: {
      hover: {
        light: 'gray-100',
        dark: 'gray-700',
      },
      active: {
        light: {
          bg: 'blue-100',
          text: 'blue-700',
        },
        dark: {
          bg: 'blue-900',
          text: 'blue-300',
        },
      },
    },

    // Focus states
    focus: {
      ring: 'blue-500',
    },
  },

  // Helper functions to get Tailwind class names
  getPrimaryClass: (variant: 'light' | 'DEFAULT' | 'dark' = 'DEFAULT') => {
    const colorMap = {
      light: 'blue-400',
      DEFAULT: 'blue-600',
      dark: 'blue-700',
    }
    return colorMap[variant]
  },

  getTextPrimaryClass: (isDark = false) => {
    return isDark ? 'text-blue-400' : 'text-blue-600'
  },

  getBgPrimaryClass: (variant: 'DEFAULT' | 'hover' = 'DEFAULT') => {
    return variant === 'hover' ? 'bg-blue-700' : 'bg-blue-600'
  },

  getBadgeClass: (isDark = false) => {
    return isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
  },

  getActiveNavClass: (isDark = false) => {
    return isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
  },
} as const

export default theme
