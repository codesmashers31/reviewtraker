/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',  // Teal 50
          100: '#ccfbf1',  // Teal 100
          200: '#99f6e4',  // Teal 200
          300: '#5eead4',  // Teal 300
          400: '#2dd4bf',  // Teal 400
          500: '#14b8a6',  // ← BRAND PRIMARY Teal
          600: '#0d9488',  // Teal 600 (header/chips default)
          700: '#0f766e',  // Teal 700
          800: '#115e59',  // Teal 800
          900: '#134e4a',  // Teal 900
        },
        secondary: {
          50: '#fff5f5',
          100: '#ffe0e0',
          200: '#ffc5c5',
          300: '#ff9d9d',
          400: '#ff8080',
          500: '#ff6b6b',  // ← CORAL ACCENT
          600: '#e05252',
          700: '#c23b3b',
          800: '#a02e2e',
          900: '#862424',
        },
        accent: {
          50: '#fff5f5',
          100: '#ffe0e0',
          200: '#ffc5c5',
          300: '#ff9d9d',
          400: '#ff8080',
          500: '#ff6b6b',  // Coral (matches secondary)
          600: '#e05252',
          700: '#c23b3b',
          800: '#a02e2e',
          900: '#862424',
        },
        success: {
          500: '#22c55e', // Success Green
        }
      },
    },
  },
  plugins: [],
}
