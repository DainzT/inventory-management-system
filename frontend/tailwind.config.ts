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
      keyframes: {
        bounceCustom: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-0.5rem)" },
        },
      },
      animation: {
        bounce1: "bounceCustom 0.6s infinite ease-in-out",
        bounce2: "bounceCustom 0.6s infinite ease-in-out 0.15s",
        bounce3: "bounceCustom 0.6s infinite ease-in-out 0.3s",
      },
    },
  },
  plugins: [],
};
