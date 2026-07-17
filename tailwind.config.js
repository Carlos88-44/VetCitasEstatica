/** Configuracion de Tailwind - sistema de diseno VetCitas */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1E40AF',
          dark: '#1E3A8A',
          50: '#EFF3FD',
          100: '#DCE6FB',
          500: '#1E40AF',
          600: '#1B3A9E',
          700: '#1E3A8A'
        },
        success: { DEFAULT: '#059669', bg: '#ECFDF5', text: '#047857' },
        danger:  { DEFAULT: '#DC2626', bg: '#FEF2F2', text: '#B91C1C' },
        warning: { DEFAULT: '#F59E0B', bg: '#FFFBEB', text: '#92400E' },
        surface: '#FFFFFF',
        canvas: '#F8FAFC',
        ink: {
          DEFAULT: '#0F172A',
          soft: '#64748B',
          faint: '#94A3B8'
        },
        line: '#E2E8F0'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
        'card-hover': '0 4px 10px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.08)',
        popover: '0 12px 32px rgba(15,23,42,0.14)'
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px'
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'scale-in': { from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } },
        'slide-up': { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
      },
      animation: {
        'fade-in': 'fade-in 0.15s ease-out',
        'scale-in': 'scale-in 0.15s ease-out',
        'slide-up': 'slide-up 0.2s ease-out'
      }
    }
  },
  plugins: []
}
