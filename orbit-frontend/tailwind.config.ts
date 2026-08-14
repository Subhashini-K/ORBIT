import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["\"Space Grotesk\"", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Orbit brand palette — used deliberately for gradients, glows, and status accents
        orbit: {
          blue: "#3B82F6",
          cyan: "#38BDF8",
          purple: "#8B5CF6",
          violet: "#A855F7",
          pink: "#EC4899",
          amber: "#F59E0B",
          emerald: "#10B981",
        },
        space: {
          950: "#04050B",
          900: "#080A14",
          850: "#0B0E1B",
          800: "#0F1320",
          700: "#161B2C",
          600: "#1E2438",
          500: "#2A3252",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-orbit": "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 60%, #A855F7 100%)",
        "gradient-orbit-radial": "radial-gradient(circle at center, rgba(59,130,246,0.35) 0%, rgba(139,92,246,0.20) 40%, rgba(4,5,11,0) 70%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        "glow-blue": "0 0 40px -8px rgba(59,130,246,0.55)",
        "glow-purple": "0 0 40px -8px rgba(139,92,246,0.55)",
        glass: "0 8px 32px 0 rgba(0,0,0,0.37)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "orbit-spin": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        "orbit-spin-reverse": { from: { transform: "rotate(360deg)" }, to: { transform: "rotate(0deg)" } },
        twinkle: { "0%, 100%": { opacity: "0.2" }, "50%": { opacity: "1" } },
        "pulse-glow": { "0%, 100%": { opacity: "0.6", transform: "scale(1)" }, "50%": { opacity: "1", transform: "scale(1.05)" } },
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "orbit-spin": "orbit-spin 60s linear infinite",
        "orbit-spin-reverse": "orbit-spin-reverse 80s linear infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
