/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff', 100: '#dbe4ff', 200: '#bac8ff',
          300: '#91a7ff', 400: '#748ffc', 500: '#3370ff',
          600: '#2b5fd9', 700: '#1e4fc2', 800: '#1a3f9e', 900: '#132e6e',
        },
      },
    },
  },
  plugins: [],
}
