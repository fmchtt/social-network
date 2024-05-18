import { indigo } from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: indigo[900],
        secondary: indigo[600],
      },
      boxShadow: {
        primary: "0px 0px 8px -5px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};
