/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F5F1EB',
          200: '#EBE4D8',
          300: '#DDD3C1',
        },
        forest: {
          950: '#0F2118',
          900: '#153124',
          800: '#1A3D2D',
          700: '#23523D',
          600: '#2F6E52',
          100: '#E6EFEA',
          50: '#F0F6F2',
        },
        terracotta: {
          50: '#FDF6F0',
          500: '#C35E2D',
          600: '#AD4F22',
          700: '#8E3F19',
        },
        charcoal: {
          900: '#161F1A',
          800: '#233029',
          700: '#34463C',
          500: '#52665A',
          400: '#738A7D',
        }
      },
      fontFamily: {
        heading: ['Manrope', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['Manrope', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
