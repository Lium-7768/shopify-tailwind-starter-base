module.exports = {
  prefix: 'twcss-',
  content: [
    './layout/*.liquid',
    './templates/*.liquid',
    './templates/customers/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
  ],
  theme: {
    screens: {
      sm: '320px',
      md: '750px',
      lg: '990px',
      xlg: '1440px',
      x2lg: '1920px',
      pageMaxWidth: '1440px',
    },
    extend: {
      colors: {
        border: '#e0e0e0',
        input: '#e0e0e0',
        ring: '#1a1a1a',
        background: '#ffffff',
        foreground: '#0a0a0a',
        primary: {
          default: '#1746A2',
          foreground: '#5F9DF7E5',
        },
        secondary: {
          default: '#5F9DF7',
          foreground: '#E3F2FF',
          light: '#C2E3FF',
        },
        destructive: {
          default: '#ff0000',
          foreground: '#ffffff',
        },
        muted: {
          default: '#EBEBEB',
          foreground: '#737373',
        },
        accent: {
          default: '#353535',
          foreground: '#1a1a1a',
        },
        popover: {
          default: '#ffffff',
          foreground: '#0a0a0a',
        },
        card: {
          default: '#ffffff',
          foreground: '#0a0a0a',
        },
      },
      fontFamily: {
        heading: 'var(--font-heading-family)',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern:
        /^twcss-(text|bg|border|ring)-(foreground|background|primary|secondary|destructive|muted|accent|popover|card)/,
    },
  ],
};
