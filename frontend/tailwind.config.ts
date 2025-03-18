/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  options: {
    safelist: [],
  },
  theme: {
    extend: {
      colors: {
        white: "#F4F4F4",
        black: "#333333",
        accent: "#1B626E",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
