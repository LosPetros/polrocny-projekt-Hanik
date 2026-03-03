/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#8c6cf8',
          DEFAULT: '#6c8ff8',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6c8ff8 0%, #8c6cf8 100%)',
        'gradient-sky': 'linear-gradient(to bottom, rgba(230, 240, 255, 0.6), rgba(255, 255, 255, 1))',
      }
    },
  },
  plugins: [],
}
