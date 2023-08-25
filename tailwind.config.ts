import defaultTheme from 'tailwindcss/defaultTheme';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#9EE073",
        secondary: "#CBE6BA",
        negative: "#EE3D3D80",
        dark: '#222222',
      },
      backgroundImage: {
        'territory-green-1': "url('/public/images/territory_green_1.jpg')",
        'territory-green-2': "url('/public/images/territory_green_2.jpg')",
        'territory-black-1': "url('/public/images/territory_black_1.jpg')",
        'territory-black-2': "url('/public/images/territory_black_1.jpg')",
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
    },
    screens: {
      "2xs": "320px",
      xs: "475px",
      ...defaultTheme.screens,
    },
  },
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
}