const ORIGINAL_CARD_WIDTH = 63; // mm
const ORIGINAL_CARD_HEIGHT = 88; // mm
const CARD_SCALE_FACTOR = 0.7;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        card: `${ORIGINAL_CARD_WIDTH * CARD_SCALE_FACTOR}mm`,
      },
      height: {
        card: `${ORIGINAL_CARD_HEIGHT * CARD_SCALE_FACTOR}mm`,
      },
    },
  },
  plugins: [],
};
