import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Student Theme Colors
        student: {
          primary: 'rgb(16 185 129)',
          dark: 'rgb(5 150 105)',
          light: 'rgb(52 211 153)',
          bg: 'rgb(236 253 245)',
          hover: 'rgb(4 120 87)',
        },
        // Rider/Driver Theme Colors
        rider: {
          primary: 'rgb(59 130 246)',
          dark: 'rgb(99 102 241)',
          light: 'rgb(96 165 250)',
          bg: 'rgb(239 246 255)',
          hover: 'rgb(37 99 235)',
        },
        // Brand Colors
        brand: {
          success: 'rgb(34 197 94)',
          warning: 'rgb(234 179 8)',
          error: 'rgb(239 68 68)',
          info: 'rgb(59 130 246)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        jakarta: ['var(--font-jakarta)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        'pulse-scale': 'pulse-scale 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
