// tailwind.config.js
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // make sure it's pointing to the ROOT node_module
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#18181B",
          // ... autres nuances si nécessaire
        },
        // Couleurs personnalisées pour le mode sombre
        dark: {
          secondary: "#A855F7",
        },
      },
    },
  },

  darkMode: "class",
  plugins: [heroui()],
};
