module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          950: "#0e0e11",
        },
        soft: {
          gogi: "rgba(255,181,185,1)",
          ginger: "rgba(255,222,181,1)",
          lemon: "rgba(255,254,180,1)",
          lime: "rgba(219,255,180,1)",
          melon: "rgba(181,255,219,1)",
          mint: "rgba(180,248,255,1)",
          lavender: "rgba(180,204,255,1)",
          acai: "rgba(236,180,255,1)",
        },
        solid: {
          goji: "rgba(255,28,39,1)",
          ginger: "rgba(255,153,28,1)",
          lemon: "rgba(255,252,28,1)",
          lime: "rgba(146,255,28,1)",
          melon: "rgba(28,255,145,1)",
          mint: "rgba(28,234,255,1)",
          lavender: "rgba(28,101,255,1)",
          acai: "rgba(198,28,255,1)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
