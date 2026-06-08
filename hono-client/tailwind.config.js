/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Urbanist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#A78BFA',    // violet-400 — for tinted surfaces
          DEFAULT: '#7C3AED', // violet-600 — main brand
          dark: '#5B21B6',    // violet-800 — deep accent
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
        'gradient-sky': 'linear-gradient(to bottom, rgba(230, 240, 255, 0.6), rgba(255, 255, 255, 1))',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
