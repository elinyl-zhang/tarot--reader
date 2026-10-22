import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Palatino Linotype"', "Palatino", "Georgia", '"Times New Roman"', "serif"],
        body: ['"EB Garamond"', "Georgia", '"Palatino Linotype"', "serif"],
      },
      letterSpacing: {
        tarot: "0.22em",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Tarot-specific theme colors — "Vintage Editorial" palette
        // Inspired by Sofia Ludina's tarot illustration: deep teal bg,
        // ink card faces, cream double-border frames, muted brass linework
        mystical: {
          900: "#0E3B33",
          800: "#145247",
          700: "#1A6154",
          600: "#22705F",
          500: "#2E8471",
          400: "#5CA391",
          300: "#93C2B3",
          200: "#BFD8CD",
          100: "#DDEAE2",
          50: "#F0F5F0",
        },
        cosmic: {
          900: "#1B1820",
          800: "#232029",
          700: "#2C2833",
          600: "#3A3542",
          500: "#4E4859",
          400: "#6E6779",
          300: "#9C96A6",
          200: "#C6C2CC",
          100: "#E4E2E7",
          50: "#F5F4F6",
        },
        gold: {
          900: "#5F5233",
          800: "#7A6A42",
          700: "#96824F",
          600: "#B29A5C",
          500: "#C9B072",
          400: "#D8C28E",
          300: "#E5D5AC",
          200: "#EFE4C8",
          100: "#F6EFDC",
          50: "#FBF7EC",
        },
        // Reference illustration accent (moon / crown purple)
        arcane: {
          DEFAULT: "#9C8BC7",
          light: "#B4A7D6",
          dark: "#7A6AA3",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "card-flip": {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(90deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        "card-deal": {
          "0%": {
            transform: "translateY(-200px) rotate(-10deg)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0) rotate(0deg)",
            opacity: "1",
          },
        },
        "mystical-glow": {
          "0%, 100%": {
            boxShadow: "0 0 18px rgba(216, 194, 142, 0.25)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(216, 194, 142, 0.45)",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-1000px 0",
          },
          "100%": {
            backgroundPosition: "1000px 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "card-flip": "card-flip 0.6s ease-in-out",
        "card-deal": "card-deal 0.8s ease-out",
        "mystical-glow": "mystical-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundImage: {
        "mystical-gradient":
          "linear-gradient(165deg, #1A6154 0%, #145247 45%, #0E3B33 100%)",
        "cosmic-gradient":
          "linear-gradient(160deg, #2C2833 0%, #1B1820 100%)",
        "card-shimmer":
          "linear-gradient(90deg, transparent, rgba(246,239,220,0.25), transparent)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
