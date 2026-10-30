/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    './postcss/handset-viewport.cjs': {},
  },
}

export default config
