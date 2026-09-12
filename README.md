# The Great Indian Table

A single-page visual archive of the people, places and workspaces behind everyday India.

## Frontend

The production site is intentionally dependency-light:

```text
index.html              page structure and copy
assets/
  app.css               all production styles
  app.js                story viewer, music UI, navigation and interactions
  stories.js            story content only
  music.js              playlist data only
  img/                  photography
```

There is no build step and no framework. The page can be served directly by Vercel, Netlify, GitHub Pages, or any static host.

## Run locally

From the project root:

```powershell
py -m http.server 8000
```

Then open `http://localhost:8000`.

Serving the project over HTTP is preferable to opening `index.html` with `file://`, because the browser's module/network security rules are closer to production behaviour.

## Story data

`assets/stories.js` is the single source of truth for the 16 stories shown in the viewer. Keep presentation and interaction logic out of this file.

## Music

`assets/music.js` is the single source of truth for the playlists. Playback is handled by `assets/app.js` through the YouTube IFrame API.

## Backend

`backend/` contains the optional Google Apps Script submission prototype from the earlier contribution flow. It is not loaded by the current single-page experience.

## Compatibility routes

`explore.html`, `gallery.html`, `story.html`, `add-your-desk.html`, and `final-index.html` are lightweight redirects kept for old links and bookmarks. The production experience lives in `index.html`.
