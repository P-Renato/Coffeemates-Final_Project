/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "#1A1A1A",
        bg1: "#F5F4F2",
        bg2: "#FFFFFF",
        bgTransparentWhite: "rgba(255, 255, 255, 0.9)",
        bgTransparentDark: "rgba(26, 26, 26, 0.9)",

        deleteBtn: "#B01D1D",
        saveBtn: "#6A8DFF",

        noBtn: "#857D7D",
        followBtn: "#908A8A",
        editProfileBtn: "#908A8A",
        sendMessageBtn: "#C4C4C4",
        chatBg: "#9EEF9E",
        profileListBg: "#FBFBED",
        greyline: "#C4C4C4",
        typeBox: "#C4C4C4",
        triangle: "#D9D9D9",
      },
      fontFamily: {
        logo: ['"Courier Prime"', 'monospace'],
        base: ['Roboto', 'sans-serif'],
        profile: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        logo: '24px',
        h1: '40px',
        h2: '16px',
        profile: '16px',
      },
      borderRadius: {
        base: '8px',
      },
      padding: {
        sidebarX: '12px',
        sidebarY: '16px',
        profileQ: '10px',
      },
      fontWeight: {
        bold: 700,
        regular: 400,
      },
    },
  },
  plugins: [],
};
