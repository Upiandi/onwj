/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2973b4',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',

          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9dfff',
          300: '#7cc4ff',
          400: '#36a3ff',
          500: '#0b7fda',    // Main - softer blue
          600: '#0066b8',    // Accent
          700: '#005299',
          800: '#004480',
          900: '#003866',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',

          50: '#fafaf9',     // Warm white
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Accent - Soft Teal (Calming, Fresh)
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        
        // Warm - Soft Gold/Amber (Friendly, Welcoming)
        warm: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },

      fontFamily: {
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },

      // ============================================
      // COMPACT FONT SIZES - Minimalist Scale
      // ============================================
      fontSize: {
        // === DISPLAY HEADINGS ===
        'display-2xl': ['3rem', {           // 48px
          lineHeight: '1.15',
          letterSpacing: '-0.025em',
          fontWeight: '700'
        }],
        'display-xl': ['2.25rem', {         // 36px
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          fontWeight: '700'
        }],
        'display-lg': ['1.875rem', {        // 30px
          lineHeight: '1.25',
          letterSpacing: '-0.015em',
          fontWeight: '700'
        }],
        'display-md': ['1.5rem', {          // 24px
          lineHeight: '1.3',
          letterSpacing: '-0.01em',
          fontWeight: '600'
        }],
        'display-sm': ['1.25rem', {         // 20px
          lineHeight: '1.4',
          letterSpacing: '-0.01em',
          fontWeight: '600'
        }],
        'display-xs': ['1.125rem', {        // 18px
          lineHeight: '1.4',
          letterSpacing: '-0.005em',
          fontWeight: '600'
        }],

        // === BODY TEXT ===
        'body-xl': ['1rem', {               // 16px
          lineHeight: '1.75',
          fontWeight: '400'
        }],
        'body-lg': ['0.9375rem', {          // 15px
          lineHeight: '1.7',
          fontWeight: '400'
        }],
        'body-md': ['0.875rem', {           // 14px
          lineHeight: '1.7',
          fontWeight: '400'
        }],
        'body-sm': ['0.8125rem', {          // 13px
          lineHeight: '1.6',
          fontWeight: '400'
        }],
        'body-xs': ['0.75rem', {            // 12px
          lineHeight: '1.5',
          fontWeight: '400'
        }],

        // === LABELS ===
        'label-lg': ['0.8125rem', {         // 13px
          lineHeight: '1',
          letterSpacing: '0.05em',
          fontWeight: '600'
        }],
        'label-md': ['0.75rem', {           // 12px
          lineHeight: '1',
          letterSpacing: '0.08em',
          fontWeight: '700'
        }],
        'label-sm': ['0.6875rem', {         // 11px
          lineHeight: '1',
          letterSpacing: '0.1em',
          fontWeight: '700'
        }],
        'label-xs': ['0.625rem', {          // 10px
          lineHeight: '1',
          letterSpacing: '0.12em',
          fontWeight: '700'
        }],
      },

      spacing: {
        'grid-1': '0.25rem',    // 4px
        'grid-2': '0.5rem',     // 8px
        'grid-2.5': '0.625rem', // 10px
        'grid-3': '0.75rem',    // 12px
        'grid-4': '1rem',       // 16px
        'grid-5': '1.25rem',    // 20px
        'grid-6': '1.5rem',     // 24px
        'grid-8': '2rem',       // 32px
        'grid-10': '2.5rem',    // 40px
        'grid-12': '3rem',      // 48px
        'grid-16': '4rem',      // 64px
        'grid-20': '5rem',      // 80px
        'grid-24': '6rem',      // 96px
        'grid-32': '8rem',      // 128px
      },

      maxWidth: {
        'content': '75rem',     // 1200px
        'container': '90rem',   // 1440px
        'prose': '65ch',
      },

      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '600ms',
        'slower': '800ms',
      },
      
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smart': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-content': 'slideInContent 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide': 'slide 30s linear infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInContent: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}