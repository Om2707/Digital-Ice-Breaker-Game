export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
      },
      animation: {
        'dice-roll': 'dice-roll 0.6s ease-out',
        'card-flip': 'card-flip 0.8s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'pop-in': 'pop-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
