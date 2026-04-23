/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",  // ✅ Fix: Correct path for App Router
    "./src/components/**/*.{js,ts,jsx,tsx}",  // ✅ Include components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        accent: "#ca8a04",
      },
    },
  },
  plugins: [],
};

