import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hanji: 'rgb(var(--hanji-rgb) / <alpha-value>)',
        'hanji-warm': 'rgb(var(--hanji-warm-rgb) / <alpha-value>)',
        'hanji-border': 'rgb(var(--hanji-border-rgb) / <alpha-value>)',
        'hanji-hover': 'rgb(var(--hanji-hover-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        'ink-soft': 'rgb(var(--ink-soft-rgb) / <alpha-value>)',
        'ink-muted': 'rgb(var(--ink-muted-rgb) / <alpha-value>)',
        'ink-accent': 'rgb(var(--ink-accent-rgb) / <alpha-value>)',
        gold: 'rgb(var(--gold-rgb) / <alpha-value>)',
        'gold-light': 'rgb(var(--gold-light-rgb) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        devanagari: ['var(--font-devanagari)', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        korean: '0.05em',
        'wide-korean': '0.15em',
      },
    },
  },
  plugins: [],
}

export default config
