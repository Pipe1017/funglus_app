/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Asegura una fuente limpia
      },
      colors: {
        // Paleta Minimalista Moderna (Ajustable a tu imagen)
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9', // Color principal (Botones, Iconos activos)
          600: '#0284c7', // Hover
          800: '#075985',
          900: '#0c4a6e', // Textos oscuros / Sidebar
        },
        surface: '#ffffff',
        background: '#f8fafc', // Gris muy claro para fondos generales
      }
    },
  },
  plugins: [],
}