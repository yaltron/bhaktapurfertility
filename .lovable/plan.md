

# Make Success Stories Detailed Like Blog Posts

## Database Migration
Add `slug` (text, unique, not null) and `content` (text, nullable) columns to `success_stories` table. Generate slug from title for existing rows.

## Files to Create

### `src/pages/SuccessStoryDetail.tsx`
New detail page modeled after `BlogPost.tsx`:
- Fetch story by slug from `success_stories`
- Display title, cover photo/video, and rich HTML content via `dangerouslySetInnerHTML`
- Back link to `/success-stories`
- Share buttons (Facebook, X, LinkedIn)

## Files to Modify

### `src/pages/admin/AdminSuccessStories.tsx`
Upgrade the admin form to match `AdminBlogs.tsx`:
- Widen dialog to `sm:max-w-4xl`
- Add `slug` field (auto-generated from title)
- Replace `description` Textarea with `RichTextEditor` for `content`
- Keep photo_url, video_url, is_featured, display_order fields
- Import and use `RichTextEditor`

### `src/pages/SuccessStories.tsx`
- Wrap each story card in a `<Link to={/success-stories/${story.slug}}>` so clicking opens the detail page
- Show excerpt from `description` field on the card

### `src/App.tsx`
- Import `SuccessStoryDetail`
- Add route: `/success-stories/:slug`

