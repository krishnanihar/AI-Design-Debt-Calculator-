/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'debt-critical': '#ef4444',
        'debt-high': '#f59e0b',
        'debt-medium': '#eab308',
        'debt-low': '#10b981',
      },
    },
  },
  plugins: [],
}
