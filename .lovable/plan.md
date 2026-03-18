

# Hero Section Fix — Mobile Video Responsiveness + Text Visibility

## Problem
The YouTube iframe background uses `scale-150` which causes black bars on mobile due to aspect ratio mismatch. The Nepali tagline text may lack contrast on smaller screens.

## Changes

### `src/pages/Index.tsx` — Hero section (lines 61-96)

**Video iframe fix:**
- Remove `scale-150` class — it doesn't reliably cover all viewports
- Instead, use CSS to force the iframe to always cover the container regardless of aspect ratio:
  - Use `min-w-[177.77vh] min-h-[56.25vw]` (maintains 16:9 coverage)
  - Center the iframe with `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`
  - Set explicit `w-[177.77vh] h-[56.25vw]` so the video always exceeds container bounds
- This mimics `object-fit: cover` behavior for iframes

**Text visibility improvements:**
- Add `text-shadow` via inline style or a utility class to the Nepali tagline for better readability
- Increase the dark overlay from `bg-black/35` to `bg-black/50` for stronger contrast
- Add `drop-shadow-lg` to the heading

**Mobile-specific:**
- Reduce `min-h-[500px]` to `min-h-[60vh]` so it scales better on small screens
- Adjust padding: `py-16 md:py-32 lg:py-40` for mobile breathing room

### Resulting structure
```text
<section class="relative overflow-hidden bg-black text-white min-h-[60vh]">
  <iframe class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  min-w-full min-h-full w-[177.77vh] h-[56.25vw]
                  opacity-50 pointer-events-none" ... />
  <div class="absolute inset-0 bg-black/50 z-[1]" />
  <div class="container relative z-10 py-16 md:py-32 lg:py-40">
    <h1 style="text-shadow: 0 2px 8px rgba(0,0,0,0.7)" ...>
  </div>
</section>
```

