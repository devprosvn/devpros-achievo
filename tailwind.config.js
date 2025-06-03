
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'muted-foreground': '#6b7280',
      },
      fontFamily: {
        'sans': ['Aptos', 'system-ui', 'sans-serif'],
        'aptos': ['Aptos', 'sans-serif'],
        'aptos-bold-italic': ['Aptos', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
