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
          500: '#2563EB', // Primary Brand Color (Royal Blue)
        },
        secondary: {
          500: '#60A5FA', // Secondary Accent
        },
        accent: {
          500: '#F59E0B', // Amber Accent
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
