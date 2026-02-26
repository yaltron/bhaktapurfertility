

# Replace #37929f with #6bbb58 as primary everywhere; keep #37929f only for button hovers

## Changes

### 1. `src/index.css`
- Update `--hero-gradient` to use green-to-green (or a subtle green gradient) instead of teal-to-green

### 2. `src/components/layout/Header.tsx` (line 17)
- Change top contact bar from `bg-[hsl(187,49%,42%)]` to `bg-primary` (green)

### 3. `src/pages/Index.tsx`
- **Line 60**: Change hero background from `bg-[hsl(187,49%,42%)]` to `bg-primary` (green)
- **Line 61**: Remove or adjust the radial gradient overlay (already green, can simplify)
- **Line 278**: Change bottom CTA strip from `bg-[hsl(187,49%,42%)]` to `bg-primary`

### 4. Button hover enhancement
- Update `src/components/ui/button.tsx` default variant hover from `hover:bg-primary/90` to `hover:bg-[#37929f]` so buttons shift to teal on hover
- Similarly update the secondary variant hover to teal tones

