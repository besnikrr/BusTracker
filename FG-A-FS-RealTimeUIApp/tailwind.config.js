/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        "primary-blue": "#0B2265",
        "secondary-blue": "#007AC9",
        "secondary-blue-dark": "#004979",
        "primary-red": "#DA291C",
        "dark-text": "#212121",
      },
    },
  },
};
