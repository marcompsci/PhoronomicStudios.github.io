# Phoronomic Studios

The GitHub Pages portfolio for Omari Bell — independent engineer and founder of Phoronomic Studios.

Live at [phoronomicstudios.com](https://phoronomicstudios.com).

## Structure

- `index.html` — the single-page site (hero, about, work, capabilities, experience, open source, contact)
- `styles.css` — the full stylesheet; design tokens live in `:root`
- `404.html` — not-found page served by GitHub Pages
- `favicon.svg`, `CNAME`

No build step and no JavaScript. Edit, commit, push to `main`.

## Design rules

- Brand name is always **Phoronomic Studios**.
- Cream grounds, warm near-black (`--ink`) sections, blue (`--blue`) for actions, orange (`--orange`) as the only accent.
- Anton for uppercase display headings, one Instrument Serif italic phrase per heading, Chivo for body, Chivo Mono for labels and navigation.
- Hairline rules and grids — no rounded cards or pills. Body copy stays under ~36em wide.
- Orange text only on dark grounds (it fails contrast on cream); on cream the accent is an orange underline.
- Every interactive element is a real link or button with the orange focus ring.
- All motion sits inside `prefers-reduced-motion: no-preference` and is never needed to read content.
- No invented testimonials, clients, or metrics.
