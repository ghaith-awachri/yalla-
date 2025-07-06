/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette professionnelle moderne
        primary: {
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B1FF',
          400: '#3397FF',
          500: '#0057A0', // Couleur principale
          600: '#004A87',
          700: '#003D6E',
          800: '#003054',
          900: '#00233B'
        },
        secondary: {
          50: '#F5F7FA', // Gris très clair
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923'
        },
        accent: {
          50: '#E6F7FF',
          100: '#CCEFFF',
          200: '#99DFFF',
          300: '#66CFFF',
          400: '#33BFFF',
          500: '#00A6ED', // Bleu clair accent
          600: '#0088CA',
          700: '#006BA7',
          800: '#004D84',
          900: '#003061'
        },
        text: {
          primary: '#1F2937', // Gris anthracite
          secondary: '#6B7280',
          light: '#9CA3AF'
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#28A745', // Vert succès
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D'
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#DC3545', // Rouge clair
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D'
        }
      }
    },
  },
  plugins: [],
};