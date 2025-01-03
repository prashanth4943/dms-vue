/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
     './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F456E',
        secondary: '#A1A291',
        neutralLight: '#EAE6D8',
        neutralDark: '#C7C9DB',
        accent: '#D1AD74',
        text: '#5C534D',
      },
      fontFamily: {
        sans: ['"Playfair Display"', 'serif'], // Thin and Roman serif
        serif: ['"Crimson Text"', 'serif'],  
      },
      borderRadius: {
        DEFAULT: '8px', 
        large: '12px',  
      },
    },
  },
  plugins: [],
};

