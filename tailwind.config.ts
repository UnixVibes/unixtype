import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'unix-bg': '#0a1e1e',
        'unix-main': '#14b8a6',
        'unix-sub': '#2dd4bf',
        'unix-sub-alt': '#0d2626',
        'unix-text': '#d1fae5',
        'unix-error': '#ef4444',
        'unix-error-dark': '#991b1b',
      },
    },
  },
  plugins: [],
};

export default config;
