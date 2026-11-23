# Bilingual Portfolio Template

A blank English and Arabic RTL portfolio. Plain HTML, CSS and JavaScript, with no build step.

## Preview

Run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`.
Use a local server so the project viewer can fetch its JSON data.

## Personalize

- Edit the six HTML pages for your headings, descriptions, skills, experience and contact details.
- Edit `entry.js` for the intro name, location and language-specific labels.
- Replace the abstract SVG placeholders in `assets/` with your own media.
- Edit `projects.json` and `projects-ar.json` together. Card `data-project` values must match their project IDs.
- Replace disabled `href="#"` social/contact placeholders with your own URLs, then remove `aria-disabled` and `data-placeholder`.
- Add your own canonical URL, social preview image and structured data only when ready to publish.
- Enable GitHub Pages from your chosen branch and repository root, or deploy to any static host.

## Pages and design

- Home: bilingual intro, dark hero, light bento collection, process, capabilities, about and contact sections.
- Work: two equal-size project grids, hover tilt, swipeable media deck and case-study fields.
- Info: illustrated skill cards, compact experience rows, tools, credentials and contact card.
- English: `index.html`, `work.html`, `info.html`.
- Arabic RTL: `index-ar.html`, `work-ar.html`, `info-ar.html`.
- All sample copy is neutral placeholder copy. All media is abstract SVG artwork, not photographs or finished projects.
- The bundled Arabic fonts retain their upstream OFL notice in `assets/fonts/`.
- Video playback support remains in the viewer. Add your own video source and poster in the JSON; no sample video is included.

## License

MIT. See `LICENSE`. Its original attribution is retained.
