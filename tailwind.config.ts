import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#1E3A8A", dark: "#0f2050", light: "#3556c4" },
        emerald: { DEFAULT: "#10B981", dark: "#0a8f66", soft: "#e6f9f1" },
        ink: { DEFAULT: "#1F2937", soft: "#6B7280" },
        mist: "#F7F9FC",
        line: "#E7EBF1",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: { marquee: "marquee 30s linear infinite" },
    },
  },
  plugins: [],
};
export default config;
