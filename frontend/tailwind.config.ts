import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#030712",
        panel: "#0B1220",
        line: "#22304A",
        signal: "#A3E635",
        aqua: "#22D3EE",
      },
      boxShadow: {
        glow: "0 0 80px rgba(124, 58, 237, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
