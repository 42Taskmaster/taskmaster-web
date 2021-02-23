/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')
const typography = require('@tailwindcss/typography')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './index.html',
      './src/**/*.vue',
      './src/**/*.md',
      './src/**/*.js',
      './src/**/*.ts',
    ],
    options: {
      safelist: ['prose', 'prose-sm', 'm-auto'],
    },
  },
  variants: {
    cursor: ['responsive', 'disabled'],
    backgroundColor: ['dark', 'hover', 'disabled'],
    borderColor: ['dark', 'active', 'focus', 'disabled'],
    textColor: ['dark', 'hover', 'active', 'disabled'],
    opacity: ['dark', 'hover', 'active', 'focus', 'disabled'],
  },
  darkMode: 'class',
  plugins: [typography, require('@tailwindcss/forms')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        teal: colors.teal,
        lightblue: colors.lightBlue,
        coolgray: colors.coolGray,
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'inherit',
            a: {
              color: 'inherit',
              opacity: 0.75,
              '&:hover': {
                opacity: 1,
                color: colors.teal[600],
              },
            },
            b: { color: 'inherit' },
            strong: { color: 'inherit' },
            em: { color: 'inherit' },
            h1: { color: 'inherit' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
            code: { color: 'inherit' },
          },
        },
      },
    },
  },
}
