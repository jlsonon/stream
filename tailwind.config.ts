import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          50: "#0D0E11",
          100: "#121417",
          200: "#17191E",
          300: "#1E2127",
        },
        cinemix: {
          primary: "#E5A93C",
          "primary-hover": "#F3B952",
          accent: "#FF3B30",
          "accent-hover": "#FF5449",
          tungsten: "#E5A93C",
          scarlet: "#E50914",
          muted: "#8E95A5",
        },
        border: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      },
      boxShadow: {
        'cinema': '0 12px 32px -4px rgba(0, 0, 0, 0.75)',
        'elevated': '0 20px 48px -8px rgba(0, 0, 0, 0.88)',
        'glow-primary': '0 0 24px rgba(229, 169, 60, 0.22)',
        'glow-accent': '0 0 24px rgba(255, 59, 48, 0.2)',
      }
    },
  },
  plugins: [],
};

export default config;
