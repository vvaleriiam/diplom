/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f0f13",
        panel: "#171720",
        panel2: "#20202b",
        violet: "#8b5cf6",
      },
      boxShadow: {
        glow: "0 0 40px rgba(139, 92, 246, 0.18)",
      },
    },
  },
  plugins: [],
};
