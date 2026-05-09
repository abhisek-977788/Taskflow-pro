/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e0e1ff',
          200: '#c4c6ff',
          300: '#a29bff',
          400: '#8074ff',
          500: '#6c63ff',
          600: '#5a4fff',
          700: '#4a3de0',
          800: '#3d32b8',
          900: '#342d94',
        },
        dark: {
          50: '#1a1a2e',
          100: '#16213e',
          200: '#0f3460',
          300: '#141428',
          400: '#0d0d1a',
          500: '#080811',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          hover: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.10)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(0,212,255,0.05) 100%)',
        'primary-gradient': 'linear-gradient(135deg, #6c63ff 0%, #3ec6e0 100%)',
        'danger-gradient': 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
        'success-gradient': 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.3)',
        glow: '0 0 20px rgba(108,99,255,0.3)',
        'glow-sm': '0 0 10px rgba(108,99,255,0.2)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(108,99,255,0.2)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        xl2: '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
