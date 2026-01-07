/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        'navy': '#0B2545',
        'navy-light': '#134074',
        'deep-teal': '#008080',

        // Apple-style Colors
        'apple-gray': '#F5F5F7',
        'apple-text': '#1D1D1F',
        'apple-blue': '#0071e3',

        // Accent Colors
        'champagne-gold': '#F7E7CE',
        'gold': '#F2B705',
        'cta-orange': '#FD7E14',

        // Status Colors
        'success-green': '#28A745',
        'error-red': '#DC3545',

        // Fresh Blues
        'fresh-blue': '#007BFF',
        'sky-blue': '#4A90D9',

        // Brand variations
        'brand-gold': '#F2B705',
        'brand-navy': '#0B2545',

        // Neutrals
        'off-white': '#F8F9FA',
        'light-gray': '#E9ECEF',
        'medium-gray': '#6C757D',
        'dark-gray': '#343A40',
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Inter', 'Roboto', 'sans-serif'],
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'premium': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 3s',
        'slow-zoom': 'slowZoom 20s ease infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #F2B705 0%, #E5A600 100%)',
        'gradient-navy': 'linear-gradient(135deg, #0B2545 0%, #134074 100%)',
        'gradient-cta': 'linear-gradient(135deg, #FD7E14 0%, #e56b0a 100%)',
      },
    },
  },
  plugins: [],
}
