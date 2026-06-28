/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0B0E1A', // Deep space canvas background
          800: '#14192F', // Panel backgrounds
          700: '#1F2647', // Borders and highlighting
          600: '#2E3763', // Interactive element offsets
        },
        nova: {
          glow: '#4FD1C5',       // Cyan core system/AI tracking indicator
          urgent: '#FF7A45',     // Urgent Amber for critical approaching deadlines
          action: '#7C6FFF',     // Violet for autonomous active agents
          telemetry: '#8A8FA3',  // Slate secondary typography for readouts
          text: '#EDEFF7'        // High-contrast primary text
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(79, 209, 197, 0.25)',
        'glow-amber': '0 0 15px rgba(255, 122, 69, 0.3)'
      }
    },
  },
  plugins: [],
}