import type { Config } from 'tailwindcss';
// @ts-expect-error - Ignore TS error until TailwindCSS adds types for scrollbar-hide
import scrollbarHide from 'tailwind-scrollbar-hide';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['PP Supply Mono', 'monospace'],
        mono: ['var(--font-geist-mono)'],
        supply: ['PP Supply Mono', 'monospace'],
        pixel: 'var(--font-free-pixel)',
      },
      backgroundImage: {
        'afel-gradient': 'linear-gradient(to bottom, #FF8000, #78FF00)',
      },
      zIndex: {
        '100': '100',
      },
      animation: {
        'gradient-x': 'gradient-x 3s linear infinite',
        slideLeft: 'slideLeft 50s linear infinite',
        slideRight: 'slideRight 50s linear infinite',
        'infinite-scroll-left': 'infinite-scroll-left 50s linear infinite',
        'infinite-scroll-right': 'infinite-scroll-right 50s linear infinite',
        'infinite-scroll': 'infinite-scroll 50s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        slideLeft: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
        slideRight: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        'infinite-scroll-left': {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
        'infinite-scroll-right': {
          '0%': {
            transform: 'translateX(-50%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        'infinite-scroll': {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
    },
  },
  plugins: [
    scrollbarHide,
    function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.pause': {
          'animation-play-state': 'paused',
        },
      });
    },
    require('tailwindcss-animate'),
  ],
};
export default config;
