import withMT from '@material-tailwind/react/utils/withMT';
import defaultTheme from 'tailwindcss/defaultTheme';

export default withMT({
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    'path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Quicksand', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#79AD57',
        secondary: '#CBE6BA',
        negative: '#EE3D3D80',
        dark: '#222222',
      },
      screens: {
        mini: '350px',
      },
    },
  },
});
