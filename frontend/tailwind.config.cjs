/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1f2937",
          foreground: "#94a3b8",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
