import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#0A0E1F",
        "indigo-deep": "#120A1F",
        "violet-ethereal": "#9F7AEA",
        "violet-lucid": "#C9A0FF",
        "violet-mid": "#6A5ACD",
        "blue-soft": "#60A5FA",
        "text-primary": "#F5F5F5",
        "text-secondary": "#B0B0C0",
        error: "#FF6B81",
      },
      fontFamily: {
        display: ["Cinzel Decorative", "serif"],
        body: ["Cormorant Garamond", "serif"],
        ui: ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        "dream-gradient": "radial-gradient(ellipse at top, #1a0a3a 0%, #0A0E1F 60%)",
        "card-glow": "linear-gradient(135deg, rgba(159,122,234,0.08) 0%, rgba(96,165,250,0.05) 100%)",
      },
      boxShadow: {
        dream: "0 0 30px rgba(159,122,234,0.15), 0 4px 24px rgba(0,0,0,0.5)",
        "dream-hover": "0 0 50px rgba(159,122,234,0.25), 0 8px 32px rgba(0,0,0,0.6)",
        "glow-violet": "0 0 20px rgba(159,122,234,0.4)",
        "glow-blue": "0 0 20px rgba(96,165,250,0.3)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "nebula-drift": "nebulaDrift 20s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        nebulaDrift: {
          "0%": { transform: "translate(0%, 0%) scale(1)" },
          "100%": { transform: "translate(3%, 5%) scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
