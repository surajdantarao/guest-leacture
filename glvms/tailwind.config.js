/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FDFDFF', // Brighter, cleaner background
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#6366F1', // Indigo 600 - more vibrant
          hover: '#4F46E5',   // Indigo 700
          light: '#EEF2FF',   // Indigo 50
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#475569', // Slate 600
          hover: '#334155',   // Slate 700
          light: '#F8FAFC',   // Slate 50
        },
        accent: {
          DEFAULT: '#06B6D4', // Cyan 500
          foreground: '#FFFFFF',
        },
        success: '#10B981', // Emerald 500
        warning: '#F59E0B', // Amber 500
        danger: '#EF4444',  // Red 500
        dark: '#0F172A',    // Slate 900
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2.5rem',
        'card': '1.25rem',
        'btn': '0.75rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'float': '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.2)',
      },
      transitionDuration: {
        '250': '250ms',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
