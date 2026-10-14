/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        plexo: {
          bg: {
            deep: '#0E0E0E',
            darkest: '#121212',
            dark: '#161616',
            surface: '#1A1A1A',
            elevated: '#222222',
            highlight: '#2A2A2A',
          },
          border: {
            subtle: '#222222',
            DEFAULT: '#262626',
            focus: '#3D3D3D',
          },
          purple: {
            DEFAULT: '#7C3AED',
            hover: '#6D28D9',
            light: '#8B5CF6',
            glow: 'rgba(124, 58, 237, 0.25)',
            border: '#6366F1',
          },
          accent: {
            cyan: '#06B6D4',
            amber: '#F59E0B',
            emerald: '#10B981',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'purple-glow': '0 0 20px -2px rgba(124, 58, 237, 0.4)',
        'panel': '0 4px 20px 0 rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
