/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "card-width": `var(--card-width)`,
        "card-height": `var(--card-height)`,
        "card-x-overlap": `var(--card-x-overlap)`,
      },
    },
  },
  plugins: [],
};
