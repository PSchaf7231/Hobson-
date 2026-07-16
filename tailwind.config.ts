import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1D33",
        "navy-mid": "#122540",
        "navy-light": "#1a3050",
        gold: "#D4AF37",
        "gold-light": "#F2E7C6",
        card: "#162035",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
        script: ["'Alex Brush'", "cursive"],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease",
      },
      boxShadow: {
        card: "0 16px 34px -12px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06)",
        glow: "0 6px 16px -4px rgba(212,175,55,.5)",
      },
    },
  },
  plugins: [],
};

export default config;
