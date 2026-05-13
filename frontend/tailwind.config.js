/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Exo 2"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        ink: '#020510',
        surface: '#050d1a',
        card: '#070f20',
        border: '#0d1f3c',
        muted: '#0f2545',
        accent: '#0ea5e9',
        'accent-light': '#38bdf8',
        'accent-glow': '#0284c7',
        'accent-2': '#06b6d4',
        emerald: {
          400: '#2dd4bf',
          500: '#14b8a6',
        },
        amber: {
          400: '#f59e0b',
        },
        rose: {
          400: '#f43f5e',
          500: '#e11d48',
        },
        slate: {
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          500: '#64748b',
          600: '#475569',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'sonar': 'sonar 3s ease-out infinite',
        'drift': 'drift 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sonar: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '33%': { transform: 'translateY(-15px) translateX(8px)' },
          '66%': { transform: 'translateY(8px) translateX(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
