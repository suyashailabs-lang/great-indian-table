/* =========================================================
   THE GREAT INDIAN TABLE — shared app logic
   Vanilla JS. No build step, no framework — keeps the site
   fast and simple to host anywhere.
   ========================================================= */

/* -----------------------------------------------------------
   GA4 / analytics stubs
   -----------------------------------------------------------
   window.dataLayer is the standard GA4 (gtag.js) queue.
   In production, drop the gtag.js snippet in <head> on every
   page and these calls will flow straight into GA4 — no other
   code changes needed. Until then, events are logged to the
   console so the click-tracking wiring can be verified.
----------------------------------------------------------- */
window.dataLayer = window.dataLayer || [];

function trackEvent(eventName, params) {
  const payload = Object.assign({ event: eventName }, params || {});
  window.dataLayer.push(payload);
  if (window.location.hostname === "localhost" || window.location.search.includes("debug=1")) {
    console.log("[GA4 event]", payload);
  }
}

// Fires on every "table explored" open — main metric from the brief.
function trackTableOpen(table, source) {
  trackEvent("table_explored", {
    table_id: table.id,
    table_name: table.name,
    profession: table.profession,
    city: table.city,
    source: source || "unknown"
  });
}

function trackFilterUse(filterType, value) {
  trackEvent("filter_used", { filter_type: filterType, filter_value: value });
}

/* Attach GA4 click tracking to any element carrying
   data-ga-event, data-ga-table-id etc. Called once per page
   after cards are rendered. */
function wireGaClickTracking(root) {
  (root || document).querySelectorAll("[data-ga-event]").forEach((el) => {
    el.addEventListener("click", () => {
      trackEvent(el.dataset.gaEvent, {
        table_id: el.dataset.gaTableId || undefined,
        table_name: el.dataset.gaTableName || undefined,
        profession: el.dataset.gaProfession || undefined,
        city: el.dataset.gaCity || undefined,
        source: el.dataset.gaSource || "gallery"
      });
    }, { passive: true });
  });
}

/* -----------------------------------------------------------
   Nav
----------------------------------------------------------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (!toggle || !mobileNav) return;
  toggle.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

/* -----------------------------------------------------------
   Card rendering (used on Home / Explore / Gallery)
----------------------------------------------------------- */
function stampInitials(profession) {
  const words = profession.split(" ").filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** "City, State" — or just "City" if state is blank (e.g. a submission
 *  that didn't use a comma/slash and couldn't be split). Never leaves a
 *  stray trailing comma. */
function cityState(t) {
  return t.state ? `${t.city}, ${t.state}` : t.city;
}

function tableCardHTML(t, source) {
  return `
    <a class="postcard" href="story.html?id=${encodeURIComponent(t.id)}"
       data-ga-event="table_explored"
       data-ga-table-id="${t.id}"
       data-ga-table-name="${t.name}"
       data-ga-profession="${t.profession}"
       data-ga-city="${t.city}"
       data-ga-source="${source || "gallery"}">
      <div class="postcard-airmail" aria-hidden="true"></div>
      <div class="postcard-photo">
        <img src="${t.photo}" alt="${t.name}'s workspace in ${t.city}" loading="lazy" width="900" height="600">
        <div class="postcard-stamp" aria-hidden="true">${stampInitials(t.profession)}<br>${t.city.slice(0, 10)}</div>
      </div>
      <div class="postcard-body">
        <span class="postcard-name">${t.name}</span>
        <span class="postcard-meta">${t.profession}<span class="dot">&middot;</span>${cityState(t)}</span>
      </div>
    </a>`;
}

function renderCards(container, tables, source) {
  if (!container) return;
  if (!tables.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No tables here yet</h3>
        <p>Try a different profession or city — new workspaces are added as they're collected.</p>
      </div>`;
    return;
  }
  container.innerHTML = tables.map((t) => tableCardHTML(t, source)).join("");
  wireGaClickTracking(container);
}

/* -----------------------------------------------------------
   Explore / filtering
----------------------------------------------------------- */
function uniqueSorted(list) {
  return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
}

function initExplore() {
  const grid = document.getElementById("explore-grid");
  const pillRow = document.getElementById("filter-pills");
  const modeButtons = document.querySelectorAll("[data-filter-mode]");
  const resultsCount = document.getElementById("results-count");
  const resultsLabel = document.getElementById("results-label");
  if (!grid || !pillRow) return;

  const tables = window.TABLES || [];
  let mode = "profession"; // or "city"
  let active = "all";

  function optionsForMode() {
    return mode === "profession"
      ? uniqueSorted(tables.map((t) => t.profession))
      : uniqueSorted(tables.map((t) => t.city));
  }

  function countFor(value) {
    if (value === "all") return tables.length;
    return tables.filter((t) => (mode === "profession" ? t.profession : t.city) === value).length;
  }

  function renderPills() {
    const options = optionsForMode();
    const pills = ["all", ...options];
    pillRow.innerHTML = pills.map((val) => {
      const label = val === "all" ? "All" : val;
      const isActive = val === active ? " is-active" : "";
      return `<button class="pill${isActive}" data-value="${val}" type="button">${label}<span class="count">${countFor(val)}</span></button>`;
    }).join("");

    pillRow.querySelectorAll(".pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        active = btn.dataset.value;
        trackFilterUse(mode, active);
        renderPills();
        renderResults();
      });
    });
  }

  function renderResults() {
    const filtered = active === "all"
      ? tables
      : tables.filter((t) => (mode === "profession" ? t.profession : t.city) === active);

    resultsLabel.textContent = active === "all" ? "All tables" : active;
    resultsCount.textContent = `${filtered.length} table${filtered.length === 1 ? "" : "s"}`;
    renderCards(grid, filtered, "explore");
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      mode = btn.dataset.filterMode;
      active = "all";
      modeButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      renderPills();
      renderResults();
    });
  });

  renderPills();
  renderResults();
}

/* -----------------------------------------------------------
   Gallery (simple, no filter chrome — pure grid)
----------------------------------------------------------- */
function initGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  renderCards(grid, window.TABLES || [], "gallery");
}

/* -----------------------------------------------------------
   Home — featured strip + live stats
----------------------------------------------------------- */
function initHomeFeatured() {
  const tables = window.TABLES || [];

  const statTables = document.getElementById("stat-tables");
  const statCities = document.getElementById("stat-cities");
  if (statTables) statTables.textContent = tables.length;
  if (statCities) statCities.textContent = uniqueSorted(tables.map((t) => t.city)).length;

  const grid = document.getElementById("home-featured");
  if (!grid) return;
  renderCards(grid, tables.slice(0, 8), "home_featured");
}

/* -----------------------------------------------------------
   Story page
----------------------------------------------------------- */
function initStory() {
  const root = document.getElementById("story-root");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const tables = window.TABLES || [];
  const table = tables.find((t) => t.id === id) || tables[0];

  if (!table) {
    root.innerHTML = `<div class="wrap"><div class="empty-state"><h3>Table not found</h3><p>This workspace may have been moved or hasn't been added yet.</p></div></div>`;
    return;
  }

  document.title = `${table.name} — ${table.profession}, ${table.city} — The Great Indian Table`;

  trackTableOpen(table, "story_page");

  const objectBlock = table.object ? `
    <div class="object-card">
      <div class="obj-icon" aria-hidden="true">&#9733;</div>
      <div>
        <b>${table.object.label}</b>
        <p>${table.object.text}</p>
      </div>
    </div>` : "";

  root.innerHTML = `
    <section class="story-hero">
      <div class="story-hero-photo">
        <img src="${table.photo}" alt="${table.name}'s workspace, a ${table.profession.toLowerCase()} in ${table.city}">
      </div>
      <div class="story-id">
        <div class="wrap">
          <span class="eyebrow" style="color:var(--marigold)">${table.profession}</span>
          <h1 class="story-name">${table.name}</h1>
          <div class="story-meta">
            <span>${cityState(table)}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="wrap story-body">
      <aside class="story-portrait">
        <div class="portrait-frame">
          <img src="${table.portrait}" alt="Portrait of ${table.name}">
        </div>
        <p class="portrait-cap">${table.name}, ${table.city}</p>
      </aside>

      <div class="story-main">
        <p class="story-intro">${table.intro}</p>

        <div class="story-section">
          <h3>A normal workday</h3>
          <p>${table.workday}</p>
        </div>

        <div class="story-section">
          <h3>One challenge</h3>
          <p>${table.challenge}</p>
        </div>

        <div class="story-section">
          <h3>One dream</h3>
          <p>${table.dream}</p>
        </div>

        <div class="story-quote">
          <p>${table.quote}</p>
        </div>

        ${objectBlock}
      </div>
    </div>
  `;

  renderStoryNav(table, tables);
}

function renderStoryNav(current, tables) {
  const nav = document.getElementById("story-nav");
  if (!nav) return;
  const idx = tables.findIndex((t) => t.id === current.id);
  const next = tables[(idx + 1) % tables.length];
  nav.innerHTML = `
    <a class="btn btn--ghost" href="explore.html">&larr; All tables</a>
    <a class="btn btn--solid" href="story.html?id=${encodeURIComponent(next.id)}"
       data-ga-event="table_explored"
       data-ga-table-id="${next.id}"
       data-ga-table-name="${next.name}"
       data-ga-profession="${next.profession}"
       data-ga-city="${next.city}"
       data-ga-source="story_next">
      Next table &rarr;
    </a>`;
  wireGaClickTracking(nav);
}

/* -----------------------------------------------------------
   "Show your desk to the world" — submission postcard
   -----------------------------------------------------------
   Static demo: no backend is wired up yet. On submit we track
   the event (so the funnel is measurable from day one, per the
   brief) and show a confirmation. Point the <form> at a real
   endpoint (Google Form, Sheet, or API route) before launch.
----------------------------------------------------------- */
/** Reads an image file, downsizes it, and returns a JPEG Base64 data URL.
 *  Resolves to null if no file was given. Keeps payloads small enough for
 *  a single Apps Script POST and fast to upload on a mobile connection. */
function readAndCompressImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    if (!file) { resolve(null); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function initDeskForm() {
  const form = document.getElementById("desk-form");
  if (!form) return;

  const intro = document.getElementById("desk-intro");
  const counter = document.getElementById("desk-intro-count");
  if (intro && counter) {
    const updateCount = () => {
      const words = intro.value.trim().split(/\s+/).filter(Boolean).length;
      counter.textContent = `${words} word${words === 1 ? "" : "s"} (aim for 40–60)`;
    };
    intro.addEventListener("input", updateCount);
    updateCount();
  }

  form.querySelectorAll(".pf-upload input[type='file']").forEach((input) => {
    input.addEventListener("change", () => {
      const labelEl = input.closest(".pf-upload").querySelector(".pf-upload-label");
      if (labelEl) labelEl.textContent = input.files[0] ? input.files[0].name : labelEl.dataset.default;
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const name = document.getElementById("desk-name");
    const endpointIsPlaceholder = form.action.includes("YOUR_FORM_ID") || form.action.includes("YOUR_DEPLOYMENT_ID");
    // Apps Script's cross-origin response often can't be read by fetch()
    // even when the submission succeeds — see backend/README.md. In that
    // case we send the request but don't wait to confirm it landed.
    const isAppsScript = form.action.includes("script.google.com");

    function showConfirmation() {
      const confirmEl = document.getElementById("pf-confirm");
      if (confirmEl) {
        confirmEl.classList.remove("is-error");
        confirmEl.classList.add("is-visible");
        confirmEl.querySelector(".pf-confirm-text").textContent =
          `Thanks${name && name.value ? ", " + name.value.split(" ")[0] : ""} — your desk is in the queue. Our field team will follow up before it goes live.`;
        confirmEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
      if (counter) counter.textContent = "0 words (aim for 40–60)";
      form.querySelectorAll(".pf-upload-label").forEach((el) => { el.textContent = el.dataset.default; });
    }

    function showError(message) {
      const confirmEl = document.getElementById("pf-confirm");
      if (confirmEl) {
        confirmEl.classList.add("is-visible", "is-error");
        confirmEl.querySelector(".pf-confirm-text").textContent = message;
        confirmEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    function resetSubmitBtn() {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Mail your desk in"; }
    }

    function setHiddenField(fieldName, value) {
      let input = form.querySelector(`input[type="hidden"][name="${fieldName}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = fieldName;
        form.appendChild(input);
      }
      input.value = value || "";
    }

    // No real endpoint wired up yet — fall back to the local-only demo
    // confirmation so the form is still testable before launch.
    if (endpointIsPlaceholder) {
      console.warn("desk-form: form.action is still the placeholder — wire it to a real endpoint before launch.");
      trackEvent("desk_submitted", {
        profession: (document.getElementById("desk-profession") || {}).value || "",
        city: (document.getElementById("desk-city") || {}).value || ""
      });
      showConfirmation();
      return;
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Preparing photos…"; }

    // Photos travel as compressed Base64 text fields, not raw files —
    // Apps Script can't reliably pull file bytes out of a cross-origin
    // multipart post, but it reads text fields fine. See
    // backend/README.md and apps-script.gs's saveImage_().
    const workspaceInput = document.getElementById("desk-workspace-photo");
    const portraitInput = document.getElementById("desk-portrait-photo");
    let workspaceB64 = null;
    let portraitB64 = null;
    try {
      [workspaceB64, portraitB64] = await Promise.all([
        readAndCompressImage(workspaceInput && workspaceInput.files[0], 1600, 0.82),
        readAndCompressImage(portraitInput && portraitInput.files[0], 1200, 0.85)
      ]);
    } catch (err) {
      showError("One of those photos couldn't be processed — try a different file, or leave it out for now.");
      resetSubmitBtn();
      return;
    }

    trackEvent("desk_submitted", {
      profession: (document.getElementById("desk-profession") || {}).value || "",
      city: (document.getElementById("desk-city") || {}).value || "",
      has_workspace_photo: !!workspaceB64,
      has_portrait_photo: !!portraitB64
    });

    if (submitBtn) submitBtn.textContent = "Mailing it in…";

    if (isAppsScript) {
      // Real browser form submission into a hidden iframe — deliberately
      // NOT fetch(). fetch()+mode:"no-cors" always reports "success" the
      // moment the request is sent, even if it never actually executes
      // server-side (wrong deployment access setting, a script error,
      // Apps Script asking for a login it can't show you) — which made
      // real failures completely invisible. A genuine <form> submission
      // is exactly what Apps Script's own docs assume you're doing, and
      // is the reliable way to get large multipart bodies (base64
      // photos) there intact. See backend/README.md if rows still don't
      // land — that's a deployment/permissions issue, not this code.
      setHiddenField("workspace_photo_base64", workspaceB64);
      setHiddenField("portrait_photo_base64", portraitB64);
      // Drop the raw file inputs from the submission — Apps Script can't
      // use them, and leaving the name on just uploads the bytes for
      // nothing. Restored further down so the form behaves normally
      // afterwards.
      if (workspaceInput) workspaceInput.name = "";
      if (portraitInput) portraitInput.name = "";

      form.submit();

      // Can't read the iframe's (cross-origin) response, so this is an
      // optimistic confirmation once the request has had a moment to go
      // out — not proof it landed. Check the Sheet, or use
      // backend/test-submit.html, if you need to confirm it actually did.
      window.setTimeout(() => {
        if (workspaceInput) workspaceInput.name = "workspace_photo";
        if (portraitInput) portraitInput.name = "portrait_photo";
        showConfirmation();
        resetSubmitBtn();
      }, 1200);
      return;
    }

    const formData = new FormData(form);
    formData.delete("workspace_photo");
    formData.delete("portrait_photo");
    if (workspaceB64) formData.set("workspace_photo_base64", workspaceB64);
    if (portraitB64) formData.set("portrait_photo_base64", portraitB64);

    fetch(form.action, {
      method: form.method || "POST",
      body: formData,
      headers: { Accept: "application/json" }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Submission failed");
        showConfirmation();
      })
      .catch(() => {
        showError("That didn't go through — check your connection and try again, or email the field team directly.");
      })
      .finally(resetSubmitBtn);
  });
}

/* -----------------------------------------------------------
   Page transitions
   -----------------------------------------------------------
   Fades the page in on load, fades it out before any internal
   link navigates away, and turns same-page anchor links (e.g.
   nav → #show-your-desk) into a smooth scroll instead of a
   hard jump. Cross-page anchors (nav on Explore linking to
   index.html#show-your-desk) fade-navigate as usual, then
   glide to the section once the new page has faded in.
----------------------------------------------------------- */
function initPageTransitions() {
  const FADE_MS = 280;

  requestAnimationFrame(() => document.body.classList.add("is-ready"));

  // Arrived with a #hash in the URL (e.g. from a cross-page link) —
  // start at the top and glide down to the section once faded in.
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      window.scrollTo(0, 0);
      window.setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, FADE_MS + 120);
    }
  }

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    let url;
    try { url = new URL(link.href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;

    const samePage = url.pathname === window.location.pathname;

    if (samePage && url.hash) {
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", url.hash);
      document.querySelector(".mobile-nav")?.classList.remove("is-open");
      return;
    }

    if (samePage) return; // same file, no hash — nothing to do

    e.preventDefault();
    document.body.classList.add("is-leaving");
    document.body.classList.remove("is-ready");
    window.setTimeout(() => { window.location.href = link.href; }, FADE_MS);
  }, false);

  // Fade out on back/forward navigation too, where supported.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      document.body.classList.remove("is-leaving");
      requestAnimationFrame(() => document.body.classList.add("is-ready"));
    }
  });
}

/* -----------------------------------------------------------
   Live submissions
   -----------------------------------------------------------
   Fetches approved "Add Your Desk" tables from the Sheets/Apps
   Script backend (see backend/README.md) and merges them into
   window.TABLES — but never blocks the first paint on it.

   Apps Script has real cold-start latency (and scans the whole
   sheet on every doGet), so waiting on it before rendering made
   every single page — Gallery, Explore, any table — feel slow.
   Instead:
     1. Render immediately with the static seed data (+ cached
        live data, if we have a fresh copy from earlier this
        session).
     2. If there's no fresh cache, fetch in the background with
        a timeout, cache the result, and re-render only if it
        actually added something new.
   Repeat navigations within LIVE_DATA_TTL_MS reuse the cache —
   no network round trip at all.

   Until LIVE_DATA_ENDPOINT is set, this is a silent no-op —
   the site just runs on the static seed data in data.js.
----------------------------------------------------------- */
const LIVE_DATA_ENDPOINT = "https://script.google.com/macros/s/AKfycbzH3lsZbOfXM__5Bvlfx-9mpOtighO1RFt-iMFaBO4QGd-ARskMFF32XCYcRliAeW6-/exec";
const LIVE_DATA_CACHE_KEY = "git_live_tables_v1";
const LIVE_DATA_TTL_MS = 5 * 60 * 1000;   // treat cached data as fresh for 5 minutes
const LIVE_DATA_TIMEOUT_MS = 6000;        // give Apps Script 6s before giving up

function isLiveDataConfigured() {
  return !LIVE_DATA_ENDPOINT.includes("YOUR_DEPLOYMENT_ID");
}

function readLiveCache() {
  try {
    const raw = sessionStorage.getItem(LIVE_DATA_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.data)) return null;
    if (Date.now() - parsed.at > LIVE_DATA_TTL_MS) return null;
    return parsed.data;
  } catch (err) {
    return null;
  }
}

function writeLiveCache(data) {
  try {
    sessionStorage.setItem(LIVE_DATA_CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch (err) {
    // storage disabled or full — fine, just means no caching this session
  }
}

/** Merges live rows into window.TABLES. Returns true if anything new was added. */
function mergeLiveTables(live) {
  if (!Array.isArray(live) || !live.length) return false;
  const existingIds = new Set((window.TABLES || []).map((t) => t.id));
  const fresh = live.filter((t) => t && t.id && !existingIds.has(t.id));
  if (!fresh.length) return false;
  window.TABLES = [...fresh, ...(window.TABLES || [])]; // newest submissions first
  return true;
}

function renderAllTables() {
  initHomeFeatured();
  initExplore();
  initGallery();
  initStory();
}

/**
 * Loads a URL as JSONP instead of fetch() — a <script> tag whose src
 * carries a ?callback=... param, and the response is JS that calls that
 * function with the data. Not subject to CORS at all, unlike fetch(),
 * which is why this is used instead: Apps Script's ContentService can't
 * set an Access-Control-Allow-Origin header, so a plain fetch() to a
 * doGet is CORS-blocked from pretty much any origin (including "null",
 * i.e. an HTML file opened directly rather than served).
 */
function jsonp(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const callbackName = `__gitJsonp_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const script = document.createElement("script");
    let settled = false;

    const cleanup = () => {
      delete window[callbackName];
      script.remove();
      clearTimeout(timer);
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("JSONP request timed out"));
    }, timeoutMs);

    window[callbackName] = (data) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("JSONP script failed to load"));
    };

    const separator = url.includes("?") ? "&" : "?";
    script.src = `${url}${separator}callback=${callbackName}`;
    document.head.appendChild(script);
  });
}

/** Background load + cache. Returns true if it changed window.TABLES. */
async function fetchAndMergeLiveTables() {
  if (!isLiveDataConfigured()) return false;

  try {
    const live = await jsonp(LIVE_DATA_ENDPOINT, LIVE_DATA_TIMEOUT_MS);
    writeLiveCache(live);
    return mergeLiveTables(live);
  } catch (err) {
    // Offline, misconfigured, slow (timed out), or the endpoint isn't
    // returning valid JSONP yet — the static seed data (already
    // rendered) stands on its own.
    console.warn("loadLiveTables: falling back to static data —", err.message);
    return false;
  }
}

/* -----------------------------------------------------------
   Boot
----------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initPageTransitions(); // fade in immediately — don't wait on the network
  initNav();

  // ?refresh=1 in the URL bypasses the cache entirely — handy right after
  // approving a row in the Sheet, when you don't want to wait out
  // LIVE_DATA_TTL_MS to see it. Also clears the stored cache so it
  // doesn't keep getting reused by the next normal page load.
  const forceRefresh = new URLSearchParams(window.location.search).get("refresh") === "1";
  if (forceRefresh) { try { sessionStorage.removeItem(LIVE_DATA_CACHE_KEY); } catch (err) {} }

  // Use a fresh cache synchronously, if we have one — instant, no fetch.
  const cached = forceRefresh ? null : readLiveCache();
  if (cached) mergeLiveTables(cached);

  renderAllTables(); // first paint — never waits on the network
  initDeskForm();
  trackEvent("page_view", { page_path: window.location.pathname + window.location.search });

  // No fresh cache — fetch in the background and re-render only if it
  // actually found something new. The page is already usable either way.
  if (!cached && isLiveDataConfigured()) {
    fetchAndMergeLiveTables().then((changed) => { if (changed) renderAllTables(); });
  }
});
