/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./modules/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Inter — body text (clean, modern, highly legible)
        "inter": ["Inter_400Regular", "sans-serif"],
        "inter-medium": ["Inter_500Medium", "sans-serif"],
        "inter-semibold": ["Inter_600SemiBold", "sans-serif"],
        "inter-bold": ["Inter_700Bold", "sans-serif"],
        // Poppins — headings (geometric, bold, attention-grabbing)
        "poppins": ["Poppins_400Regular", "sans-serif"],
        "poppins-medium": ["Poppins_500Medium", "sans-serif"],
        "poppins-semibold": ["Poppins_600SemiBold", "sans-serif"],
        "poppins-bold": ["Poppins_700Bold", "sans-serif"],
        "poppins-extrabold": ["Poppins_800ExtraBold", "sans-serif"],
        // Cormorant Garamond — branding only
        "cg-bold": ["CG-Bold", "serif"],
      },
      colors: {
        primary: {
          50:  "#E6F4FE",
          100: "#D6EBF6",
          200: "#9BD1EF",
          300: "#64C1F6",
          400: "#38B6FF",
          500: "#39B6FE",
          600: "#28B4FA",
          700: "#20A6FD",
          800: "#004AAD",
          DEFAULT: "#20A6FD",
        },
        "gradient-start": "#5DE0E6",
        "gradient-end":   "#004AAD",
        secondary: "#FFCB1A",
        danger:    "#F75555",
        success:   "#22C55E",
        warning:   "#F59E0B",
        dark: {
          100: "#4F5C62",
          200: "#2C3539",
          300: "#1A2225",
          400: "#000000",
        },
        light: {
          100: "#BDBDC0",
          200: "#DEDFE3",
          300: "#F0F0F4",
          400: "#FFFFFF",
        },
        accent: { 100: "#FBDFBD" },
      },
      spacing: {
        "4.5": "18px",
        "13":  "52px",
        "15":  "60px",
        "18":  "72px",
        "22":  "88px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
