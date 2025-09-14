const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: "#8B4513", // Sabahan brown
            secondary: "#DAA520", // Sabahan gold
            background: "#FFF8DC", // Sabahan cream
          },
        },
        dark: {
          colors: {
            primary: "#D2691E", // Lighter Sabahan brown
            secondary: "#FFD700", // Bright gold
            background: "#2F1B14", // Dark Sabahan brown
          },
        },
      },
    }),
  ],
}