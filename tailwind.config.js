/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html", 
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          primary: '#000000', 
          link: "#646cff", 
          "link-hover": "#535bf2", 
          button: "#1a1a1a", 
          "button-text": "#ffffff", 
        },
        fontFamily: {
          sans: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
        },
      },
    },
    plugins: [],
  };
  