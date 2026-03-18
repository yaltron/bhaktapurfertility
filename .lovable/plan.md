

# Replace Favicon with Custom Logo

## Steps

1. **Copy uploaded image to public directory**
   - Copy `user-uploads://BIVF_1-2.png` to `public/favicon.png`

2. **Update `index.html`**
   - Replace the existing favicon link with: `<link rel="icon" href="/favicon.png" type="image/png">`
   - Add Apple touch icon: `<link rel="apple-touch-icon" href="/favicon.png">`

3. **Update `src/components/SEO.tsx`**
   - Update the default OG image reference from `/favicon.ico` to `/favicon.png`

