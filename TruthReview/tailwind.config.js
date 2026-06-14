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
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffc9c9',
          300: '#ffa3a3',
          400: '#ff7373',
          500: '#bf4342', // Terracotta Red
          600: '#8c1c13', // Deep Rust Red brand primary
          700: '#74150e',
          800: '#5f100a',
          900: '#4a0b06',
        },
        secondary: {
          50: '#fdf6f6',
          100: '#fbebeb',
          200: '#f7d2d2',
          300: '#f0abab',
          400: '#e57c7b',
          500: '#bf4342', // Terracotta secondary
          600: '#a73433',
          700: '#8c2626',
          800: '#732020',
          900: '#601b1b',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffeed6',
          200: '#ffd8ad',
          300: '#ffbd7a',
          400: '#ffa047',
          500: '#ff8811', // Pumpkin Orange brand accent
          600: '#e06e00',
          700: '#b85300',
          800: '#913f00',
          900: '#733100',
        },
        success: {
          500: '#22c55e', // Success Green
        }
      },
    },
  },
  plugins: [],
}
