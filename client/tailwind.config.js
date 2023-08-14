/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blueBlock: '#4290d8',
        redBlock: '#F87171',
        greenBlock: '#4ADE80',
      },
    },
  },
  plugins: [],
};
