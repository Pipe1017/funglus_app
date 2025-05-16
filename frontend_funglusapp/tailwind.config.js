/** @type {import('tailwindcss').Config} */
module.exports = { // <--- Así para v3
  content: [
    "./index.html",
    "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}