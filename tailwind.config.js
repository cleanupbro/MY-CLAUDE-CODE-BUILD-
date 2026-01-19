/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ========================================
        // LUXURY DARK THEME (Apple iPhone 17 Pro Inspired)
        // ========================================
        'luxury': {
          'bg': '#000000',
          'bg-secondary': '#1C1C1E',
          'bg-tertiary': '#2C2C2E',
          'surface': '#3A3A3C',
          'text': '#FFFFFF',
          'text-secondary': '#8E8E93',
          'text-muted': '#48484A',
          'accent': '#0066CC',
          'accent-light': '#2997FF',
          'gold': '#F2B705',
          'success': '#30D158',
          'error': '#FF453A',
          'warning': '#FFD60A',
        },

        // Antigravity Orb Colors (Google-inspired)
        'orb': {
          'blue': '#3186FF',
          'yellow': '#FBBC04',
          'red': '#FC413D',
          'green': '#00B95C',
          'teal': '#2FA1D6',
        },

        // Brand Colors
        'brand-gold': '#F2B705',
        'brand-blue': '#0066CC',
        'brand-teal': '#2FA1D6',

        // Legacy support
        'navy': '#0B2545',
        'navy-light': '#134074',
        'deep-teal': '#008080',
        'apple-gray': '#F5F5F7',
        'apple-text': '#1D1D1F',
        'apple-blue': '#0071e3',
        'champagne-gold': '#F7E7CE',
        'gold': '#F2B705',
        'success-green': '#30D158',
        'error-red': '#FF453A',
      },

      fontFamily: {
        'sans': ['Google Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'display': ['Google Sans', 'Inter', 'sans-serif'],
        'body': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'heading': ['Google Sans', 'Montserrat', 'sans-serif'],
      },

      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '28px',
        '3xl': '32px',
      },

      boxShadow: {
        // Luxury dark theme shadows
        'luxury-sm': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'luxury-md': '0 4px 16px rgba(0, 0, 0, 0.5)',
        'luxury-lg': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'luxury-xl': '0 16px 48px rgba(0, 0, 0, 0.7)',

        // Glow effects
        'glow-blue': '0 0 30px rgba(0, 102, 204, 0.4)',
        'glow-gold': '0 0 30px rgba(242, 183, 5, 0.4)',
        'glow-teal': '0 0 30px rgba(47, 161, 214, 0.4)',
        'glow-success': '0 0 30px rgba(48, 209, 88, 0.4)',

        // Card shadows
        'card': '0 8px 32px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.25)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },

      animation: {
        // Fade animations
        'fade-in': 'fadeIn 0.6s ease forwards',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in-down': 'fadeInDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',

        // Antigravity orb floating animations
        'float-1': 'float1 20s ease-in-out infinite',
        'float-2': 'float2 18s ease-in-out infinite',
        'float-3': 'float3 22s ease-in-out infinite',
        'float-4': 'float4 24s ease-in-out infinite',
        'float-5': 'float5 19s ease-in-out infinite',

        // Interactive animations
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',

        // Legacy
        'slow-zoom': 'slowZoom 20s ease infinite',
      },

      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          'from': { opacity: '0', transform: 'translateY(-30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },

        // Antigravity orb floating keyframes
        float1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(30px, -50px) scale(1.05)' },
          '50%': { transform: 'translate(-40px, 20px) scale(0.95)' },
          '75%': { transform: 'translate(50px, 40px) scale(1.02)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(-40px, 30px) scale(1.03)' },
          '50%': { transform: 'translate(30px, -20px) scale(0.97)' },
          '75%': { transform: 'translate(-20px, -40px) scale(1.01)' },
        },
        float3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(50px, -30px) scale(1.08)' },
          '66%': { transform: 'translate(-30px, 50px) scale(0.94)' },
        },
        float4: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '20%': { transform: 'translate(-60px, 20px) scale(1.04)' },
          '40%': { transform: 'translate(20px, -60px) scale(0.96)' },
          '60%': { transform: 'translate(40px, 30px) scale(1.02)' },
          '80%': { transform: 'translate(-30px, -20px) scale(0.98)' },
        },
        float5: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(45px, -35px) scale(1.06)' },
          '50%': { transform: 'translate(-25px, 45px) scale(0.95)' },
          '75%': { transform: 'translate(-50px, -25px) scale(1.03)' },
        },

        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 102, 204, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 102, 204, 0.6)' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },

      backgroundImage: {
        'gradient-luxury': 'linear-gradient(180deg, #000000 0%, #1C1C1E 100%)',
        'gradient-blue': 'linear-gradient(135deg, #0066CC 0%, #2997FF 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F2B705 0%, #E5A600 100%)',
        'gradient-teal': 'linear-gradient(135deg, #2FA1D6 0%, #008080 100%)',
        'gradient-navy': 'linear-gradient(135deg, #0B2545 0%, #134074 100%)',
      },

      backdropBlur: {
        'xs': '4px',
        '2xl': '40px',
        '3xl': '64px',
      },

      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'soft': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}
