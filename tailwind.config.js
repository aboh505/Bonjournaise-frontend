/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette de couleurs personnalisée
        'primary': {
          '50': '#f3e8d7',
          '100': '#ead9b8',
          '200': '#e0c797',
          '300': '#d5b475',
          '400': '#cba054',
          '500': '#c08b32',
          '600': '#a47728',
          '700': '#88631e',
          '800': '#6c4e13',
          '900': '#503a09',
        },
        // Couleur du thème principal - amber pour représenter les plats camerounais
        'theme': {
          DEFAULT: '#d97706', // amber-600
          'dark': '#f59e0b', // amber-500
        }
      },
      fontFamily: {
        'sans': ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-geist-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      aspectRatio: {
        'video': '16 / 9',
      },
    },
  },
  plugins: [
    // Plugin pour les ratios d'aspect
    function({ addComponents }) {
      addComponents({
        '.aspect-w-16': {
          position: 'relative',
          paddingBottom: '56.25%',
        },
        '.aspect-h-9': {
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
      });
    },
  ],
}
