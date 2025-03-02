/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",  // ✅ Fix: Correct path for App Router
    "./src/components/**/*.{js,ts,jsx,tsx}",  // ✅ Include components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
