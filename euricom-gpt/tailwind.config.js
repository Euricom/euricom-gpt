/** @type {import('tailwindcss').Config} */
import tailwindColors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      current: tailwindColors.current,
      transparent: tailwindColors.transparent,
      primary: {
        DEFAULT: '#52abc7',
        200: '#387d91',
        300: '#295c6e',
        400: '#1c3d4a',
        content: '#ffffff'
      },
      secondary: {
        DEFAULT: '#607d8b',
        200: '#4c646f',
        300: '#394B53',
        content: '#ffffff'
      },
      info: {
        DEFAULT: '#3abef7',
        content: ' #012b3e'
      },
      success: {
        DEFAULT: '#37d39a',
        content: '#013321'
      },
      warning: {
        DEFAULT: '#fabd22',
        content: '#382800'
      },
      error: {
        DEFAULT: '#e4677e',
        content: '#470000'
      },
      help: {
        DEFAULT: '#9c27b0',
        content: '#ffffff'
      },
      accent: {
        DEFAULT: '#00ff00',
        content: '#000000'
      },
      base: {
        100: '#ffffff',
        200: '#E5E5E5',
        300: '#CCCCCC',
        content: '#1f2937'
      }
    },
    fontFamily: {
      sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      serif: [...defaultTheme.fontFamily.serif],
      mono: [...defaultTheme.fontFamily.mono]
    },
    extend: {}
  },
  plugins: []
}
