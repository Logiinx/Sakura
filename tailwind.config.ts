/**
 * This file configures Tailwind CSS for the project.
 * Tailwind CSS is a utility-first CSS framework that allows you to build designs
 * directly in your markup using classes like `p-4`, `text-center`, etc.
 */

// Import the necessary type definition for the Tailwind config.
import type { Config } from "tailwindcss"
// Import the 'tailwindcss-animate' plugin, often used by shadcn-ui for animations.
import tailwindcssAnimate from "tailwindcss-animate"

// Export the configuration object.
export default {
  // Configure dark mode to be triggered by a 'class' (usually 'dark') on the HTML element.
  darkMode: ["class"],
  // Specify the files Tailwind should scan to find class names and generate the necessary CSS.
  // It includes TypeScript/TSX files in various common directories.
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}", // Common in Next.js projects
    "./src/**/*.{ts,tsx}",
  ],
  // An optional prefix for all Tailwind classes (e.g., 'tw-'). Empty means no prefix.
  prefix: "",
  // The 'theme' section is where you customize Tailwind's default design system.
  theme: {
    // Configuration for the 'container' class, used for centering content.
    container: {
      center: true, // Center the container horizontally.
      padding: "2rem", // Default horizontal padding.
      screens: {
        // Maximum width for the container at different breakpoints.
        "2xl": "1400px", // On screens 1536px and wider, max-width is 1400px.
      },
    },
    // The 'extend' section allows adding new values or modifying existing ones without overwriting defaults.
    extend: {
      // Customizing colors.
      colors: {
        // These colors use CSS variables defined in a global CSS file (like index.css).
        // This is a common pattern with shadcn-ui for theming.
        // 'hsl(var(--border))' means: use the HSL color value stored in the CSS variable '--border'.
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))", // Used for focus rings, etc.
        background: "hsl(var(--background))", // Default background color.
        foreground: "hsl(var(--foreground))", // Default text color.
        // Primary color palette (often used for buttons, links).
        primary: {
          DEFAULT: "hsl(var(--primary))", // The main primary color.
          foreground: "hsl(var(--primary-foreground))", // Text color for elements with primary background.
        },
        // Secondary color palette (often used for less prominent elements).
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Destructive color palette (often used for error states, delete buttons).
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // Muted color palette (for subdued text or backgrounds).
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        // Accent color palette (often used for highlights or selected states).
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // Popover color palette (for popups, tooltips, dropdowns).
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Card color palette (for card components).
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom sidebar color palette.
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
        // Custom 'sakura' theme colors. These are directly defined hex codes.
        // You can use these in Tailwind like `bg-sakura-pink`, `text-sakura-dark-text`.
        sakura: {
          white: "#FFFFFF",
          pink: "#FFC1CC",
          green: "#D4E4D2",
          "light-pink": "#FFF0F5",
          "dark-text": "#333333",
          "light-gray": "#F8F8F8",
        },
      },
      // Customizing border radius using CSS variables (likely defined in index.css).
      // This allows changing the radius consistently across the app.
      borderRadius: {
        lg: "var(--radius)", // e.g., rounded-lg
        md: "calc(var(--radius) - 2px)", // e.g., rounded-md
        sm: "calc(var(--radius) - 4px)", // e.g., rounded-sm
      },
      // Defining custom CSS keyframe animations.
      keyframes: {
        // Animation for accordion opening.
        "accordion-down": {
          from: { height: "0" }, // Start with height 0
          to: { height: "var(--radix-accordion-content-height)" }, // Animate to full height
        },
        // Animation for accordion closing.
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" }, // Start at full height
          to: { height: "0" }, // Animate to height 0
        },
        // Fade-in animation with upward movement.
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        // Fade-out animation with upward movement.
        "fade-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
        },
      },
      // Defining utility classes to apply the keyframe animations.
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out", // e.g., animate-accordion-down
        "accordion-up": "accordion-up 0.2s ease-out", // e.g., animate-accordion-up
        "fade-in": "fade-in 0.6s ease-out", // e.g., animate-fade-in
        "fade-out": "fade-out 0.6s ease-out", // e.g., animate-fade-out
      },
      // Defining custom font families.
      // These can be used with classes like `font-playfair` or `font-montserrat`.
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"], // Serif font
        montserrat: ["Montserrat", "sans-serif"], // Sans-serif font
        "bad-script": ['"Bad Script"', "cursive"], // Cursive font
      },
    },
  },
  // Adding Tailwind plugins.
  // 'tailwindcss-animate' provides utilities for the animations defined above.
  plugins: [tailwindcssAnimate],
  // TypeScript assertion: ensures the config object matches the 'Config' type from Tailwind.
} satisfies Config
