import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fira Code', 'monospace'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        'unix-bg': '#0a0e1a',
        'unix-bg-alt': '#0d1b2a',
        'unix-main': '#14b8a6',
        'unix-sub': '#5eead4',
        'unix-sub-alt': '#0d1b2a',
        'unix-text': '#f0fdfa',
        'unix-error': '#ef4444',
        'unix-error-dark': '#991b1b',
        'unix-success': '#10b981',
        'unix-accent': '#06b6d4',
        'unix-purple': '#8b5cf6',
        'unix-purple-light': '#a78bfa',
        'unix-blue': '#3b82f6',
        'unix-border': '#134e4a',
        'unix-border-light': '#1e5b5a',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'tech': '0 0 20px rgba(20, 184, 166, 0.3)',
        'tech-lg': '0 0 40px rgba(20, 184, 166, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
