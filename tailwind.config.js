/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0d1117',
        card: '#161b27',
        border: '#2d3347',
        gold: '#f59e0b',
        silver: '#9ca3af',
        bronze: '#d97706',
        accent: '#4ade80',
      },
    },
  },
  plugins: [],
}
