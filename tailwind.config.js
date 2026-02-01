/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: 'var(--color-dark)',
        light: 'var(--color-light)',
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        sans: ['SF Pro', 'system-ui', 'sans-serif'],
        display: ['SF Pro', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
