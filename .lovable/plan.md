

# Update Website Theme Colors to Match Logo

Update the CSS custom properties and hero gradient to use the logo's brand colors:
- **Primary**: `#6bbb58` (green) → HSL ~110 41% 54%
- **Secondary/Ring**: `#37929f` (teal) → HSL ~187 49% 42%
- **Accent**: `#b3dfe4` (light teal) → HSL ~187 42% 80%

## Files to Modify

### 1. `src/index.css`
Update `:root` CSS variables:
- `--primary`: change from `176 73% 32%` to `110 41% 54%` (green)
- `--secondary`: adjust to use light green tones (`110 30% 95%`)
- `--secondary-foreground`: `110 41% 30%`
- `--accent`: change from `122 39% 49%` to `187 42% 80%` (light teal)
- `--accent-foreground`: dark text for readability on light teal (`187 49% 20%`)
- `--ring`: match primary green
- `--muted`: light green-tinted neutral
- `--border`/`--input`: light green-tinted borders
- `--sidebar-primary`/`--sidebar-ring`: match primary green
- `--sidebar-accent`: light green tint
- `--hero-gradient`: gradient from `#37929f` (teal) to `#6bbb58` (green)
- Update `.dark` theme variants accordingly with slightly adjusted lightness values

### 2. `tailwind.config.ts`
No structural changes needed — colors are driven by CSS variables.

### 3. `src/components/layout/Header.tsx`
- Update top contact bar from `bg-primary` to use the teal secondary (`bg-[#37929f]`) for visual contrast with the green primary buttons

### 4. `src/pages/Index.tsx`
- Update hero section background from teal to a gradient using the new brand colors (`from-[#37929f] to-[#6bbb58]` or via the CSS `--hero-gradient` variable)

