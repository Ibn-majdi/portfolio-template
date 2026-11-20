# Portfolio Template

A bilingual (English + Arabic RTL) personal portfolio website. Static: no build
step, no dependencies. Open `index.html` or serve the folder with any static
server.

## Use it for your own site

1. Click **Use this template → Create a new repository** (or fork/clone this repo).
2. Replace the placeholder content (table below).
3. Publish on GitHub Pages: **Settings → Pages → Deploy from a branch → main / root**.
   Your site appears at `https://<your-username>.github.io/<your-repo>/`.

## What to personalize

Every spot that needs your content is also marked with a `PERSONALIZE` comment
in the HTML (`للتخصيص` in the Arabic pages).

| File | What to change |
| --- | --- |
| `index.html` / `index-ar.html` | Your name, city, intro text, entry screen, footer |
| `work.html` / `work-ar.html` | One card per project. Each card's `data-project` must match an `id` in the JSON |
| `projects.json` / `projects-ar.json` | Project titles, descriptions, and media lists (English / Arabic) |
| `info.html` / `info-ar.html` | Skills, experience, tools, education, languages, contact links |
| `entry.js` | The name and taglines shown on the entry screen when switching language |
| `assets/` | Replace the placeholder images and video; keeping the same filenames keeps everything working |
| Social links | Header icons and the contact card: replace `href="#"` with your URLs (WhatsApp: `https://wa.me/<your international number, no +>`) |
| Canonical / OG URLs | In each page's `<head>`, swap `your-username.github.io/portfolio-template` for your real address |

## Structure

- `index.html`, `work.html`, `info.html` — home, selected work, info & contact
- `index-ar.html`, `work-ar.html`, `info-ar.html` — the Arabic editions (RTL)
- `styles.css`, `arabic.css`, `language.css`, `info-cards.css` — all styles
- `script.js` — mobile menu, scroll reveal, footer year
- `entry.js` — the intro screen and language choice
- `gallery.js`, `gallery-ar.js` — the project viewer (images and video)
- `projects.json`, `projects-ar.json` — the project data the viewer reads
- `assets/` — images, video, and fonts (IBM Plex Sans Arabic, OFL licensed)

The site is plain static HTML/CSS/JS with no build step. To publish your copy, enable GitHub Pages in your repository settings (Settings → Pages, branch: main, folder: / (root)).
