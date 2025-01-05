/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
     './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#002B5B', // Deep dark blue for a strong base
        secondary: '#FFFBEA', // Soft, creamy white with a hint of yellow
        neutralLight: '#FAF9F6', // Very light, almost white background
        neutralDark: '#475569', // Muted blue-grey for subtle text and borders
        accent: '#FFD700', // Bold and vibrant gold-yellow for accents
        text: '#3D3D3D', // Neutral dark grey for readable text
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'], // Clean, modern sans-serif
        serif: ['Poppins', 'serif'], // Elegant serif for headings
        display: ['Kanit', 'sans-serif'], // Slightly quirky for highlights
      },
      borderRadius: {
        DEFAULT: '6px', // Softer curves for modern feel
        large: '10px',  
        pill: '50px', // Rounded pill shape for buttons or badges
      },
      backgroundImage: {
        // 'hero-pattern': "url('/bg-img.jpg')",
        'hero-pattern': "url('/yellowbg1.png')",
      },
      spacing: {
        '72': '18rem', // Larger spacings for modern layouts
        '80': '20rem',
        '96': '24rem',
      },
    },
  },
  plugins: [],
};

