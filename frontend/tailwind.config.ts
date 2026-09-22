import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08101e",
        foreground: "#f8fafc",
        card: "#0d1b2e",
        "card-border": "#1e3a5f",
        "gov-navy": "#0B192C",
        "gov-blue": "#1E3E62",
        "ice-cyan": "#00F0FF",
        "polar-white": "#E2F1E7",
        "status-ok": "#10B981",
        "status-warn": "#F59E0B",
        "status-crit": "#EF4444",
      },
    },
  },
  plugins: [],
};
export default config;
