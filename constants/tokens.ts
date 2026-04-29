/**
 * Design tokens — single source of truth for Masqany's visual language.
 *
 * These values are mirrored in tailwind.config.ts for NativeWind className usage.
 * Use these tokens in StyleSheet.create() or inline styles where Tailwind
 * classes are not available (e.g., react-native-maps, chart libraries).
 *
 * Brand palette derived from: #20a6fd, #28b4fa, #39b6fe, #5de0e6 → #004aad
 */

export const colors = {
  // Primary brand blues
  primary: {
    50: "#E6F4FE",
    100: "#D6EBF6",
    200: "#9BD1EF",
    300: "#64C1F6",
    400: "#38B6FF",
    500: "#39B6FE",   // core brand blue
    600: "#28B4FA",
    700: "#20A6FD",
    800: "#004AAD",   // deep navy
  },

  // Gradient endpoints
  gradient: {
    start: "#5DE0E6",  // teal
    end: "#004AAD",    // deep navy
    midBlue: "#20A6FD",
  },

  // Secondary / accent
  secondary: "#FFCB1A",
  danger: "#F75555",
  success: "#22C55E",
  warning: "#F59E0B",

  // Neutrals
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
  accent: {
    100: "#FBDFBD",
  },
} as const;

export const typography = {
  family: {
    // Inter — body text
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    // Poppins — headings
    headingRegular: "Poppins_400Regular",
    headingMedium: "Poppins_500Medium",
    headingSemiBold: "Poppins_600SemiBold",
    headingBold: "Poppins_700Bold",
    headingExtraBold: "Poppins_800ExtraBold",
    // Branding
    brandBold: "CG-Bold",
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 19,
    xl: 22,
    "2xl": 26,
    "3xl": 30,
    "4xl": 36,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;
