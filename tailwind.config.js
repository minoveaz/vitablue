/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./marketing-studio/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Option 3 Brand Color Tokens (White-label modern palette)
        "vb-ocean": "#005F73",      // Deep Ocean/Teal Blue (Primary brand color)
        "vb-mint": "#94D2BD",       // Soft Mint Green (Accent/Secondary)
        "vb-gold": "#EE9B00",       // Amber Gold (CTA/High conversion accent)
        "vb-midnight": "#001219",   // Dark Midnight Blue (Text & Dark backgrounds)
        
        // Semantic mappings for UI components
        "primary": "#005F73",       // Primary links & headers -> Ocean
        "primary-dark": "#001219",  // Hover & Dark text -> Midnight
        "accent": "#EE9B00",        // Call to action buttons -> Gold
          "accent-dark": "#7A4F00",   // Gold text with accessible contrast
        "brand-cyan": "#94D2BD",    // Badges & Success metrics -> Mint
        "success-strong": "#0F766E", // Accessible success text on light surfaces
        "whatsapp": "#25D366",      // WhatsApp action
        "whatsapp-dark": "#20BA5A", // WhatsApp hover state
        "background-light": "#f8fafc",
        "background-dark": "#001219",
        "surface-soft": "#f4f7f8",
        "surface-muted": "#e8edef",
        "text-main": "#001219",     // Main text body -> Midnight
        "text-secondary": "#4a5568",
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "display": ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
