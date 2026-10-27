/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FAF7F2',
          2: '#FFFFFF',
          3: '#F3EFE6',
          dark: '#E7DFD3',
        },
        ink: {
          DEFAULT: '#111317',
          2: '#4B5563',
          3: '#6B7280',
          muted: '#9CA3AF',
          light: '#E5E7EB',
        },
        accent: {
          DEFAULT: '#059669',
          hover: '#047857',
          fg: '#FFFFFF',
          wash: '#ECFDF5',
        },
        pop: {
          DEFAULT: '#FFDE59',
          hover: '#FACC15',
          wash: '#FEF9C3',
          dark: '#EAB308',
        },
        status: {
          lost: '#EF4444',
          'lost-wash': '#FEE2E2',
          found: '#10B981',
          'found-wash': '#D1FAE5',
          matched: '#8B5CF6',
          'matched-wash': '#EDE9FE',
          resolved: '#6B7280',
          'resolved-wash': '#F3F4F6',
          pending: '#F59E0B',
          'pending-wash': '#FEF3C7',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        heavy: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'hard-sm': '2px 2px 0px 0px #111317',
        'hard': '3px 3px 0px 0px #111317',
        'hard-md': '5px 5px 0px 0px #111317',
        'hard-lg': '8px 8px 0px 0px #111317',
        'hard-pop': '4px 4px 0px 0px #111317',
        'hard-accent': '4px 4px 0px 0px #059669',
        'hard-white': '4px 4px 0px 0px #FFFFFF',
      },
      borderWidth: {
        '2.5': '2.5px',
        '3': '3px',
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
