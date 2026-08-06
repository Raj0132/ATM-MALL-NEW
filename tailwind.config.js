/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display:  ['"Cinzel"', 'serif'],
        elegant:  ['"Cormorant Garamond"', 'serif'],
        body:     ['Inter', 'system-ui', 'sans-serif'],
        sans:     ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#F0CC6E',
          pale:    '#FAE9B8',
          dark:    '#8B6B2A',
        },
        obsidian: {
          DEFAULT: '#08080E',
          mid:     '#0D0D18',
          rich:    '#111120',
        },
        ivory: '#F5F0E8',
        cream: '#FAF7F2',
      },
      boxShadow: {
        luxury: '0 32px 80px rgba(0,0,0,0.5)',
        gold:   '0 0 60px rgba(201,168,76,0.25)',
        'gold-sm': '0 0 20px rgba(201,168,76,0.15)',
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(90deg, #8B6B2A 0%, #C9A84C 20%, #F0CC6E 35%, #FAE9B8 50%, #F0CC6E 65%, #C9A84C 80%, #8B6B2A 100%)',
      },
      animation: {
        'shimmer':      'shimmerGold 4s linear infinite',
        'float-gold':   'floatGold 6s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 3s ease-in-out infinite',
        'spin-slow':    'spinSlow 20s linear infinite',
      },
    },
  },
  plugins: [],
}
