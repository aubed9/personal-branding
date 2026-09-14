/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Electric Cobalt Intelligence
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        obsidian: {
          950: '#000000',
          900: '#08080a',
          850: '#101014',
          800: '#17171c',
          750: '#1f1f26',
          700: '#282832',
        },
        accent: {
          cobalt: '#2563eb',
          azure: '#38bdf8',
          emerald: '#10b981',
          silver: '#e4e4e7',
          platinum: '#f4f4f5',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.75)',
        'cobalt-glow': '0 0 30px -5px rgba(37, 99, 235, 0.4)',
        'cobalt-sm': '0 0 14px -2px rgba(37, 99, 235, 0.3)',
        'white-subtle': '0 0 20px -5px rgba(255, 255, 255, 0.1)',
        'bevel': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'bevel-blue': 'inset 0 1px 0 0 rgba(147, 197, 253, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-in-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
        'glow': 'glow 3s infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(37, 99, 235, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(37, 99, 235, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
