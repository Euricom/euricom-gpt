/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },

        //Changes Euricom to adapt Azure (add euricom colors)
        accentEuricom: {
          50: "#e7ffe4",
          100: "#c9ffc4",
          200: "#98ff90",
          300: "#56ff50",
          400: "#00ff00",
          500: "#00e606",
          600: "#00b809",
          700: "#008b07",
          800: "#076d0d",
          900: "#0b5c11",
          DEFAULT: "#00ff00"
        },
        info: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7ed4fb",
          400: "#3abef7",
          500: "#0fa6e8",
          600: "#0385c6",
          700: "#046aa0",
          800: "#085a84",
          900: "#0d4b6d",
          DEFAULT: "#3abef7"
        },
        primaryEuricom: {
          50: "#f0fafb",
          100: "#d8eff5",
          200: "#b7e0ea",
          300: "#84c8dc",
          400: "#52abc7",
          500: "#308caa",
          600: "#2a7190",
          700: "#285d76",
          800: "#284e62",
          900: "#264253",
          DEFAULT: "#52abc7"
        },
        secondaryEuricom: {
          50: "#f4f6f7",
          100: "#e2e8eb",
          200: "#c8d4d9",
          300: "#a2b6be",
          400: "#758f9b",
          500: "#648290",
          600: "#4d616d",
          700: "#43525b",
          800: "#3c474e",
          900: "#353d44",
          DEFAULT: "#648290"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
}
