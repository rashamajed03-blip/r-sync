import type { Config } from "tailwindcss";

/**
 * R-SYNC Design Tokens
 * -----------------------------------------------------------------------
 * Background   #09090B   near-black, the "booth at 2am" base
 * Card         #111113   raised surface
 * Border       #262626   hairline separation, never pure white
 * Cyan         #22D3EE   primary accent — energy, motion, "match found"
 * Purple       #A855F7   secondary accent — harmonic / AI moments
 * Text         #FAFAFA   primary text
 * Muted        #8A8A93   secondary text
 * -----------------------------------------------------------------------
 */

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1360px" },
    },
    extend: {
      colors: {
        background: "#09090B",
        surface: {
          DEFAULT: "#111113",
          raised: "#17171A",
        },
        border: "#262626",
        cyan: {
          DEFAULT: "#22D3EE",
          soft: "#67E8F9",
          dim: "#0E7490",
        },
        purple: {
          DEFAULT: "#A855F7",
          soft: "#D8B4FE",
          dim: "#6B21A8",
        },
        foreground: "#FAFAFA",
        muted: "#8A8A93",
        "muted-2": "#5A5A63",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(34, 211, 238, 0.35)",
        "glow-purple": "0 0 40px -8px rgba(168, 85, 247, 0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 50% 0%, rgba(34,211,238,0.08), transparent 60%)",
        "cyan-purple":
          "linear-gradient(135deg, #22D3EE 0%, #A855F7 100%)",
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "spin-slow-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 60s linear infinite",
        "spin-slow-reverse": "spin-slow-reverse 90s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
