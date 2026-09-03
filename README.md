# The Great Indian Table

A static, visual archive of real tables, desks, and workspaces across India.

## Requirements

- A modern web browser
- Python 3, or another local static-file server

No package installation, build step, or environment variables are required for the frontend.

## Run locally

From the project root, start a local server:

```powershell
py -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

To stop the server, press `Ctrl+C` in the terminal.

> Avoid opening the HTML files directly with `file://`: serving them locally more closely matches production behavior and prevents browser restrictions around requests.

## Pages

- `index.html` - interactive map and home page
- `explore.html` - browse tables
- `gallery.html` - visual gallery
- `story.html` - individual table stories
- `add-your-desk.html` - contribution form
- `final-index.html` - alternate/final landing-page version

## Project structure

```text
assets/
  app.js       Shared frontend behaviour
  data.js      Table/story data
  style.css    Shared styling
  img/         Local image assets
backend/
  apps-script.gs       Google Apps Script submissions endpoint
  test-submit.html     Manual endpoint test page
```

## Submission backend

The optional submission flow is implemented in `backend/apps-script.gs`. It is intended to run as a Google Apps Script web app backed by a Google Sheet and Drive folder. Before deploying it, replace the configured sheet and folder IDs with resources you control, then configure the deployed web-app URL in the frontend as needed.

## Deployment

Deploy the repository contents to any static host, such as Netlify, GitHub Pages, or Vercel. Set the publish directory to the repository root and use `index.html` as the entry page.

The site loads D3, TopoJSON, Google Fonts, and map data from external CDNs, so a network connection is required for those features.
