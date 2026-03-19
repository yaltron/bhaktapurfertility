

# Add YouTube Video Background to Hero Section

## Approach
Embed the YouTube video (`DzHMq7loLYc`) as a background iframe in the hero section with reduced opacity, overlaid with a dark/green tint so text remains readable.

**Note:** YouTube videos are embedded via iframe. To use as a background, the iframe will be positioned absolutely behind the hero content with `pointer-events-none` to prevent interaction, and opacity reduced. YouTube's embed URL with `autoplay=1&mute=1&loop=1&controls=0&showinfo=0&playlist=DzHMq7loLYc` will ensure seamless looping without controls.

## Changes

### `src/pages/Index.tsx` — Hero section (lines ~59-84)
- Replace the radial gradient background with:
  - A full-cover `iframe` (YouTube embed) positioned absolutely, with `opacity-30` and `pointer-events-none`
  - A dark overlay div (`bg-black/50`) on top of the video for text contrast
  - Keep existing text and buttons unchanged
- Structure:
  ```
  <section className="relative overflow-hidden text-white">
    <!-- YouTube iframe: absolute, full cover, opacity-30, pointer-events-none -->
    <!-- Dark overlay: absolute, bg-black/50 -->
    <!-- Content: relative z-10, unchanged -->
  </section>
  ```

