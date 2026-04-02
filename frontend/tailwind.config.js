/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blacklocust: {
          white: '#FFFFFF',
          surface: '#FAFAFA',
          black: '#111111',
          gold: '#C19A6B',
          text: {
            primary: '#111111',
            secondary: '#6B7280',
          },
          border: '#E5E7EB',
          cta: '#000000',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 18px 45px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        xl2: '1rem',
      },
      spacing: {
        section: '80px',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

