/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c5cdc5',
          300: '#9daa9d',
          400: '#8b9687', // Main corporate color
          500: '#6f7f6f',
          600: '#5f6d5f',
          700: '#4c574c',
          800: '#404840',
          900: '#363c36',
        },
        cream: '#faf9f6',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};