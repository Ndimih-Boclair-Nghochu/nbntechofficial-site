import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

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
        // Palette modelled on hooyia.net: deep indigo-navy + teal accent +
        // cool near-white sections. `navy` = indigo-navy, `cyan` = teal (kept
        // the token names so usage across the codebase is unchanged).
        canvas: "#FBFBFF",
        surface: "#FFFFFF",
        sand: {
          // cool light tint for section alternation
          DEFAULT: "#F1F4FB",
          soft: "#F6F8FC",
          deep: "#E7EDF8",
        },
        navy: {
          DEFAULT: "#04045E",
          50: "#EEEFFB",
          100: "#D9DBF4",
          700: "#0A0A85",
          800: "#050572",
          900: "#04045E",
          950: "#030A3B",
        },
        // teal accent (#52CDB5)
        cyan: {
          DEFAULT: "#2FB49A",
          soft: "#6FD8C3",
          deep: "#1F8E7A",
        },
        // indigo accent used for some CTAs on hooyia
        iris: {
          DEFAULT: "#4F46E5",
          deep: "#4338CA",
        },
        ink: {
          DEFAULT: "#111633", // headings — deep indigo-ink
          body: "#464B63", // body text (grey like hooyia)
          muted: "#6B7192",
          line: "#E4E7F2",
        },
      },
      fontFamily: {
        // Wired to next/font CSS variables in app/layout.tsx. Headings use
        // Poppins (like hooyia); body uses Inter.
        serif: ["var(--font-poppins)", "system-ui", "sans-serif"],
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
        glow: "0 0 0 1px rgba(47,180,154,0.35), 0 8px 30px rgba(47,180,154,0.20)",
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
        DEFAULT: { css: { maxWidth: "68ch" } },
        // On-brand article typography — used as `prose prose-nbn`.
        nbn: {
          css: {
            "--tw-prose-body": "#464B63",
            "--tw-prose-headings": "#111633",
            "--tw-prose-lead": "#464B63",
            "--tw-prose-links": "#1F8E7A",
            "--tw-prose-bold": "#111633",
            "--tw-prose-counters": "#6B7192",
            "--tw-prose-bullets": "#2FB49A",
            "--tw-prose-hr": "#E4E7F2",
            "--tw-prose-quotes": "#111633",
            "--tw-prose-quote-borders": "#2FB49A",
            "--tw-prose-captions": "#6B7192",
            "--tw-prose-code": "#111633",
            "--tw-prose-pre-code": "#E7EDF8",
            "--tw-prose-pre-bg": "#030A3B",
            "--tw-prose-th-borders": "#E4E7F2",
            "--tw-prose-td-borders": "#E4E7F2",
            maxWidth: "68ch",
            lineHeight: "1.75",
            "h1, h2, h3, h4": {
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              letterSpacing: "-0.015em",
              fontWeight: "700",
            },
            h2: { marginTop: "2.4em", marginBottom: "0.8em", fontSize: "1.6em" },
            h3: { marginTop: "1.8em", fontSize: "1.25em" },
            a: { fontWeight: "600", textDecoration: "none" },
            "a:hover": { textDecoration: "underline" },
            blockquote: {
              fontStyle: "normal",
              fontWeight: "500",
              borderLeftWidth: "3px",
              paddingLeft: "1.1em",
              color: "#111633",
            },
            img: { borderRadius: "0.85rem" },
            "ul > li::marker": { color: "#2FB49A" },
            strong: { fontWeight: "700" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
