# Saving & publishing "Add Your Desk" submissions

The site is static (no server), so a Google Sheet plays the role of the
database, and a small Apps Script sits in front of it: one endpoint takes
new submissions in, another hands approved ones back out as JSON for the
site to render.

Flow: **submit → pending row in Sheet → your team reviews & adds photos →
flip status to "approved" → it shows up on Explore/Gallery/Story on the
next page load.** No redeploy needed to publish a table — just edit the
sheet.

## 1. Create the Sheet

1. Make a new Google Sheet, name it whatever you like.
2. Rename the first tab to `Submissions`.
3. In row 1, paste these headers, one per column, in this exact order:

   ```
   timestamp | id | status | name | profession | city | state | intro | workday | challenge | dream | quote | interesting_object | workspace_photo_url | portrait_photo_url | consent
   ```

4. Copy the Sheet's ID out of its URL — the long string between `/d/` and
   `/edit`.

## 1b. Create a Drive folder for photos

1. Make a new folder in Google Drive — e.g. "Great Indian Table – Photos".
2. Copy its ID out of the folder's URL (same `/folders/FOLDER_ID` pattern).
   You'll paste this into the script as `PHOTOS_FOLDER_ID`.

Every photo submitted through the form lands here automatically, named
`<submission-id>-workspace.jpg` / `<submission-id>-portrait.jpg`, already
set to "anyone with the link can view" so they render on the site.

## 2. Add the script

1. In the Sheet: **Extensions → Apps Script**.
2. Delete the placeholder code and paste in `backend/apps-script.gs`
   (this folder).
3. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with the Sheet ID from step 1,
   and `PASTE_YOUR_DRIVE_FOLDER_ID_HERE` with the folder ID from step 1b.
4. Save.

## 3. Deploy it as a web app

1. **Deploy → New deployment**.
2. Type: **Web app**.
3. Execute as: **Me**. Who has access: **Anyone**.
4. Deploy, authorize it when prompted — this time it'll also ask for
   **Drive** access (to save photos into the folder from step 1b) as well
   as **Sheets** access. Approve both.
5. Copy the `/exec` URL you're given — you'll need it twice.

If you're updating an *existing* deployment after pasting in this newer
version of the script (the one with photo uploads), use **Deploy → Manage
deployments → Edit → New version**, not "New deployment" — that keeps the
same URL so you don't have to update the site again. You'll be asked to
re-authorize for the new Drive access either way.

## 4. Wire the site to it

Two places:

- **`add-your-desk.html`** — set the form's `action` to your `/exec` URL:
  ```html
  <form ... action="https://script.google.com/macros/s/AKfycb.../exec" ...>
  ```
- **`assets/app.js`** — set `LIVE_DATA_ENDPOINT` near the top of the file
  to the same URL. This is what every page uses to fetch approved tables
  on load.

Until both of those are filled in, the site quietly falls back to demo
behaviour (local-only confirmation, static seed data only) — nothing
breaks in the meantime.

## 5. Reviewing & publishing a submission

1. A new row lands in `Submissions` with `status = pending`. If the
   person attached photos in the form, `workspace_photo_url` and
   `portrait_photo_url` are usually already filled in — the script saves
   them to your Drive folder and links them automatically.
2. Check the row over: does it read well, do the photo links actually
   open, is `consent = yes`? If a photo is missing (they skipped it, or
   the upload failed), collect it the old way — Drive/WhatsApp/email —
   and paste a public view link into the relevant column yourself.
3. Once both photo links are filled in and the content looks right,
   change `status` to `approved`.
4. That's it — the row now shows up in `doGet()`'s output, and the site
   picks it up on the next load (see the caching notes from earlier in
   this project for exact timing).

## Why photos aren't fully hands-off

Apps Script's `doPost` can't reliably pull real file bytes out of a
cross-origin form post — it only gets text fields. The workaround: the
site reads each photo in the browser, downsizes it, and converts it to a
Base64 text string (`assets/app.js`'s `readAndCompressImage`) *before*
sending it — so by the time it reaches Apps Script, it's just another
text field, and `saveImage_()` decodes it back into a real image file in
your Drive folder.

This gets you automatic uploads without a new service, but it's not
bulletproof: very large or unusual image files can still fail to process
in the browser, and someone could submit with no photo at all. That's why
the review step still matters — check that both links actually resolve
to real photos before flipping a row to `approved`.

If you outgrow this — say, submissions pick up and manual review of every
photo becomes the bottleneck — the next step up is a proper backend with
file storage, e.g. Firebase (Firestore + Storage) or Supabase. Both have
a JS SDK you can drop into these same static pages with no build step,
and both would let you replace this Sheet with a real database entirely.
Worth it later; likely overkill for now.

## Debugging a submission

The form posts into a hidden iframe now (see "A note on CORS" below for
why), so you won't see Apps Script's response on screen anymore — which
is normally what you want, but makes debugging trickier. Two ways to see
what actually happened:

1. **Browser DevTools → Network tab.** Submit the form, find the POST
   request to your `/exec` URL, open its **Response** tab. You'll see
   something like:
   ```json
   {
     "ok": true,
     "id": "3fcc0c42-...",
     "workspace_photo_saved": true,
     "portrait_photo_saved": true,
     "workspace_photo_attached": true,
     "portrait_photo_attached": true
   }
   ```
   `*_attached` tells you whether a photo was actually sent from the
   browser; `*_saved` tells you whether `saveImage_()` managed to write
   it to Drive. `attached: true, saved: false` means the photo arrived
   fine but saving it failed — check the next step.

2. **Apps Script editor → Executions** (clock icon in the left sidebar).
   Click the most recent `doPost` run. If a photo failed to save, you'll
   see the real error there (from the `console.error` in `saveImage_`) —
   almost always one of:
   - `PHOTOS_FOLDER_ID` is still the placeholder text, or points to a
     folder that doesn't exist / your account can't access.
   - The deployment hasn't been re-authorized for Drive access since you
     added photo uploads — redeploy (**New version**) and accept the
     permission prompt.
   - The image file itself was unusually large or an odd format the
     browser couldn't re-encode — try a different photo.

If `workspace_photo_attached` / `portrait_photo_attached` are both
`false`, the browser never sent a photo at all — check that a file was
actually selected before hitting submit, and check the browser console
for a "Preparing photos…" step that never finished (a sign the image
compression itself failed on that file).

## A note on CORS

Two different requests hit this endpoint, and they hit CORS differently:

- **Submitting the form (POST)** — this doesn't use `fetch()` at all
  anymore, for the same underlying reason: no CORS headers means a
  `fetch()` can't reliably read the response either way, and early on
  that made real failures invisible (`mode: "no-cors"` reports "success"
  the instant the request is sent, whether or not it actually worked).
  Instead, the form does a genuine browser submission into a hidden
  `<iframe>` — see the "Debugging a submission" section above for how to
  actually see what came back.
- **Loading approved tables (GET)** — this one genuinely needs to read
  the response, and `ContentService` has no way to set an
  `Access-Control-Allow-Origin` header. A plain `fetch()` here would
  get CORS-blocked from virtually any origin, including `null` (an
  HTML file opened directly rather than served). That's why this isn't
  a `fetch()` at all — `assets/app.js`'s `jsonp()` loads it as a
  `<script>` tag instead, which sidesteps CORS entirely. `doGet` in
  `apps-script.gs` supports this via a `?callback=` param.

If you ever see a CORS error in the console pointing at the `/exec` URL
with a GET request, it almost always means the deployed script is an
older version that predates the JSONP support above — redeploy via
**Deploy → Manage deployments → Edit → New version** to pick it up.
