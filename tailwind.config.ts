import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#05070A",
        gold: "#D4AF37"
      },
      boxShadow: {
        glow: "0 0 40px rgba(212,175,55,0.25)"
      }
    }
  },
  plugins: []
} satisfies Config;
