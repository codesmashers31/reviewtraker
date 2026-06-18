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
<<<<<<< HEAD
          500: '#2563EB', // Primary Brand Color (Royal Blue)
        },
        secondary: {
          500: '#60A5FA', // Secondary Accent
        },
        accent: {
          500: '#F59E0B', // Amber Accent
=======
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
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
        },
        roseGold: '#D4A5A5', // Kept for compatibility if used specifically
        background: '#F8FAFC', // Main Background (Slate 50)
        surface: '#FFFFFF', // Surface Background
        card: '#FFFFFF', // Card Background
        text: '#0F172A', // Headings (Slate 900)
        textBody: '#334155', // Body (Slate 700)
        textMuted: '#64748B', // Captions/Muted (Slate 500)
        borderSubtle: '#E2E8F0', // Slate 200
        success: {
          500: '#22c55e',
        }
      },
      boxShadow: {
        'premium': '0px 10px 30px rgba(0, 0, 0, 0.05)',
        'premium-sm': '0px 4px 10px rgba(0, 0, 0, 0.03)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'glow': '0px 0px 20px rgba(37, 99, 235, 0.15)',
      },
      borderRadius: {
        '4xl': '24px',
        '5xl': '32px',
      }
    },
  },
  plugins: [],
}
