import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0a192f",
        pink: "#ff007f",
        banana: "#ffe135",
        ink: "#e7eefc",
        smoke: "rgba(231, 238, 252, 0.08)",
        smoke2: "rgba(231, 238, 252, 0.12)",
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(255, 0, 127, 0.5), 0 0 24px rgba(255, 0, 127, 0.18)",
        banana: "0 0 0 1px rgba(255, 225, 53, 0.55), 0 0 26px rgba(255, 225, 53, 0.16)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "SF Pro Display", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

