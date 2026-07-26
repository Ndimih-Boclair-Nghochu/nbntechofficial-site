import type { Config } from "tailwindcss";

/**
 * NBN TECH design tokens.
 * Palette derived from the shield logo: navy field + cyan/sky border.
 * Cyan is used sparingly (links, tags, icons, underlines) — never as a fill wash.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Classic palette: warm ivory canvas + crisp white surfaces + a warm
        // "sand" tint for section alternation. Pure white reserved for cards.
        canvas: "#F4F1E9",
        surface: "#FFFFFF",
        sand: {
          DEFAULT: "#ECE6D9",
          soft: "#F0EBDF",
          deep: "#E4DBC9",
        },
        navy: {
          DEFAULT: "#0B1E3C",
          50: "#F2F5FA",
          100: "#E2E9F3",
          700: "#12305C",
          800: "#0E2749",
          900: "#0B1E3C",
          950: "#07142A",
        },
        cyan: {
          DEFAULT: "#4FC3F7",
          soft: "#8AD7FB",
          deep: "#1E9FE0",
        },
        ink: {
          DEFAULT: "#0F172A", // headings / near-black
          body: "#475569", // body text
          muted: "#64748B",
          line: "#E2E8F0",
        },
      },
      fontFamily: {
        // Wired to next/font CSS variables in app/layout.tsx
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "hero": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
      },
      maxWidth: {
        content: "1200px",
        prose: "68ch",
      },
      spacing: {
        section: "clamp(4rem, 10vw, 8rem)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,30,60,0.04), 0 8px 30px rgba(11,30,60,0.06)",
        "card-hover": "0 2px 4px rgba(11,30,60,0.06), 0 18px 50px rgba(11,30,60,0.12)",
        glow: "0 0 0 1px rgba(79,195,247,0.35), 0 8px 30px rgba(79,195,247,0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "68ch",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
