/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        jrv: {
          bg: "#fff7f8",
          surface: "#ffffff",
          soft: "#f9e6eb",
          ink: "#2a151b",
          muted: "#765d64",
          rose: "#b11f55",
          "rose-dark": "#761436",
          gold: "#b9862f",
          green: "#18745a",
          line: "#ead4da"
        }
      },
      boxShadow: {
        jrv: "0 18px 45px rgba(65, 18, 33, 0.12)"
      },
      borderRadius: {
        jrv: "8px"
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};
