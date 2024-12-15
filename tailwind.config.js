/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      'sans': ['Roboto', 'sans-serif'],
      'mono': ['Roboto', 'monospace'],
    },
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        'app-bg': {
          light: '#F8FAFC',
          dark: '#0F172A'
        },
        'app-card': {
          light: '#E2E8F0',
          dark: '#1E293B'
        },
        'app-hover': {
          light: '#CBD5E1',
          dark: '#334155'
        },
        'app-text-primary': {
          light: '#0F172A',
          dark: '#F8FAFC'
        },
        'app-text-secondary': {
          light: '#64748B',
          dark: '#94A3B8'
        },
        'app-accent-primary': '#8B5CF6',
        'app-accent-secondary': '#A78BFA',
        'app-success-primary': '#22C55E',
        'app-success-hover': '#16A34A',
        'app-danger-primary': '#EF4444',
        'app-danger-hover': '#DC2626',
        'app-border': {
          light: '#CBD5E1',
          dark: '#475569'
        },
      },
      fontSize: {
        'timer': '20rem',
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash': 'flash 1s ease-in-out infinite',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'flash': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
  },
};
