

# Add Logo Image to Website

## Steps

1. **Copy logo to project**: Copy `user-uploads://BIVF.png` to `src/assets/logo.png`

2. **Update Header (`src/components/layout/Header.tsx`)**:
   - Import logo: `import logo from "@/assets/logo.png"`
   - Replace text-only logo link with `<img>` + clinic name side by side
   - Logo size: ~40px height on desktop, ~32px on mobile

3. **Update Footer (`src/components/layout/Footer.tsx`)**:
   - Import and display logo next to clinic name in the about column

