/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#EAF4EE',
          100: '#D5E9DE',
          200: '#ADCFC0',
          300: '#85B5A1',
          500: '#3D7C63',
          700: '#235D46',
          800: '#174A35', // Deep Forest Green primary
          900: '#0E2E21',
        },
        tealbrand: {
          50: '#E8F6F4',
          100: '#C5EBE6',
          300: '#6CC5B8',
          500: '#2A9D8F', // Brand Teal
          700: '#1D6B62',
        },
        alert: {
          amber: '#F2B84B',
          red: '#D9534F',
          green: '#2A9D8F',
        },
        ink: {
          dark: '#263238', // Dark text
          muted: '#546E7A',
          light: '#ECEFF1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
