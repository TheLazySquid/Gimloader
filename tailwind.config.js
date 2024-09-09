import flowbitePlugin from 'flowbite/plugin.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.svelte', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // flowbite-svelte
        primary: {
          50: '#f5f0ff',
          100: '#f5f0ff',
          200: '#ebe0ff',
          300: '#ddccff',
          400: '#c9adff',
          500: '#925dfe',
          600: '#6e2eef',
          700: '#6928eb',
          800: '#5c23cd',
          900: '#491ba5'
        }
      }
    },
  },
  plugins: [flowbitePlugin]
}