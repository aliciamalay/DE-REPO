# Load-Bearing — Substack Dashboard Setup Checklist

Manual steps for **substack.com/@mokshaspace** (Substack has no API/automation
for these — apply by hand in the dashboard, ~10 minutes).

## 1. Settings → Publication Details
- **Publication name:** `Load-Bearing`
- **Tagline:**
  ```
  I write about what homes hold, how spaces are cleared, and why it matters more than most people think.
  ```

## 2. Settings → Design
- **Background color:** `#F2EDE4`
- **Accent color:** `#C8AE88`
- **Logo:** upload `substack/moksha_mark_only.svg` (ink stroke, transparent background — reads correctly on the cream page background)
- **Cover image:** full-width warm architectural photo — stone corridor or empty room, directional golden-hour light, no people, no staging. Minimum 1500px wide.
  - Source from Unsplash: search "corridor sunlight," "empty interior warm light," "stone hallway golden hour"
- **Email font:** Serif (closest available match to Cormorant)

## 3. Settings → Custom Domain (optional)
- Suggested: `loadbearing.mokshaspace.co`
- Fallback default: `mokshaspace.substack.com`

## 4. About Page
- Create a new post, write the content from `substack/about-page.md`, then set it as the About page under Settings → About page.
- Use Substack's native formatting (headings, italics, horizontal rules) — no custom HTML needed.
- Add the header image (same photographic direction as the cover image).

## Known platform limits (do not try to work around these)
- Custom fonts (Cormorant/Raleway) will not render in emails — email font setting only offers a closest match.
- No custom CSS on individual posts.
- Background color applies to web view; email background may not match.
- Accent color only affects buttons/links.

The brand carries through via: the header image on each post, disciplined post
formatting (see `post-template.md`), and the writing voice — not through code
Substack won't run.
