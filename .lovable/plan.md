

# Improve Hero Video Visibility

## Changes

### `src/pages/Index.tsx`
- Increase iframe opacity from `opacity-30` to `opacity-50` so the video is more visible
- Reduce dark overlay from `bg-black/50` to `bg-black/35` to let more video through
- Change section background from `bg-primary` to `bg-black` so the green tint doesn't dominate when video loads

This keeps the text readable via the dark overlay while making the video much more visible and reducing the green cast.

