/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
      },
      colors: {
        vyra: {
          blue: '#0070f3',
          dark: '#0a0a0a',
          accent: '#1e3a8a',
          silver: '#e5e7eb'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'vyra-gradient': 'linear-gradient(135deg, #060d18 0%, #0a1526 50%, #040914 100%)',
      },
    },
  },
  plugins: [],
}
