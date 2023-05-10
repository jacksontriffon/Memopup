import daisyui from "daisyui";
import containerQueries from "@tailwindcss/container-queries";
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neutral-800": "#1A1A1A",
        "neutral-700": "#232323",
        "neutral-600": "#393C42",
        "neutral-500": "#64676B",
        "neutral-100": "#FFFFFF",
      },
    },
  },
  daisyui: {
    themes: [
      {
        storycheque: {
          primary: "#016BFF",
          secondary: "#393C42",
          accent: "#C68E00",
          neutral: "#64676B",
          "base-100": "#1A1A1A",
          "base-200": "#232323",
          "base-300": "#393C42",
        },
      },
    ],
  },
  plugins: [daisyui, containerQueries],
} satisfies Config;
