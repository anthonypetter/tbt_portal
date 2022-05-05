module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "soph-dark-blue": "#557A95",
        "soph-light-blue": "#7ca3bf",
        "soph-light-blue-2": "#7395AE",
        "deep-blue": "#031534",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
