/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./volunteer.html",
    "./pets.html",
    "./consent.html",
    "./feedback.html",
    "./admin.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border, 220 13% 91%))",
        input: "hsl(var(--input, 220 13% 91%))",
        ring: "hsl(var(--ring, 142 52% 40%))",
        background: "hsl(var(--background, 40 33% 98%))",
        foreground: "hsl(var(--foreground, 222 47% 11%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 142 52% 40%))",
          foreground: "hsl(var(--primary-foreground, 0 0% 100%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 24 95% 53%))",
          foreground: "hsl(var(--secondary-foreground, 0 0% 100%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 210 40% 96%))",
          foreground: "hsl(var(--muted-foreground, 215 16% 47%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 210 40% 96%))",
          foreground: "hsl(var(--accent-foreground, 222 47% 11%))",
        },
      },
    },
  },
  plugins: [],
}
