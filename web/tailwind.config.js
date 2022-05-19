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
      spacing: {
        "screen-nav": "calc(100vh - 4rem)",
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-debug-screens"),
  ],
};
