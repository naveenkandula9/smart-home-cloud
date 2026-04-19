/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Manrope", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        ink: "#04101f",
        surface: "#081526",
        cyanGlow: "#52d8ff",
        amberGlow: "#ffcb52",
      },
      boxShadow: {
        ambient: "0 25px 70px rgba(1, 10, 24, 0.55)",
        neon: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0, 0, 0, 0.4)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -18px, 0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.08)" },
        },
        meteor: {
          "0%": { transform: "translateX(-20%) translateY(0)", opacity: "0" },
          "10%": { opacity: "0.85" },
          "100%": { transform: "translateX(120%) translateY(36px)", opacity: "0" },
        },
      },
      animation: {
        drift: "drift 8s ease-in-out infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
        meteor: "meteor 7s linear infinite",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
