/**
 * THE GREAT INDIAN TABLE — submissions backend
 * -----------------------------------------------------------
 * Paste this into a Google Apps Script project bound to a
 * Google Sheet. It does two jobs:
 *
 *   doPost(e)  — a new "Add Your Desk" submission comes in from
 *                the site and gets appended as a row with
 *                status = "pending". Photos arrive as Base64
 *                text (not raw files — see saveImage_ below)
 *                and get saved straight into a Drive folder.
 *
 *   doGet(e)   — the site asks "what's approved?" on every page
 *                load, and gets back a JSON array shaped exactly
 *                like the objects in assets/data.js, ready to be
 *                merged into window.TABLES.
 *
 * Setup — see backend/README.md for the full walkthrough.
 */

const SHEET_ID = "1EPhJ8TYIZH4BYSCqit0efIMLg4J0BvY7b3wHLFcqp1k";
const SHEET_NAME = "Submissions";
const PHOTOS_FOLDER_ID = "1NkjqAva7Y5JUXPuH3L6eCTPaP46IHZSY";

// Column order in row 1 of the sheet. Keep this in sync with
// the header row you create — see README.
const COLUMNS = [
  "timestamp", "id", "status",
  "name", "profession", "city", "state",
  "intro", "workday", "challenge", "dream", "quote",
  "interesting_object", "workspace_photo_url", "portrait_photo_url",
  "consent", "latitude", "longitude"
];

function getSheet_() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  ensureHeaders_(sheet);
  return sheet;
}

function ensureHeaders_(sheet) {
  const current = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  const missing = COLUMNS.filter((name) => current.indexOf(name) === -1);
  if (missing.length) {
    sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing]);
  }
}

/**
 * Decodes a "data:image/jpeg;base64,...." string (as sent by
 * assets/app.js's readAndCompressImage) and saves it into
 * PHOTOS_FOLDER_ID. Returns a hotlinkable URL, or "" on any
 * failure — a bad/missing photo should never break the whole
 * submission. Failures are logged (Executions tab → click a run →
 * see Logs) instead of swallowed silently, since "" alone doesn't
 * say whether nothing was attached or something actually broke.
 */
function saveImage_(base64DataUrl, filename) {
  if (!base64DataUrl) return "";
  try {
    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/.exec(base64DataUrl);
    const mime = match ? match[1] : "image/jpeg";
    const data = match ? match[2] : base64DataUrl;

    const bytes = Utilities.base64Decode(data);
    const blob = Utilities.newBlob(bytes, mime, filename);

    const folder = DriveApp.getFolderById(PHOTOS_FOLDER_ID);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return "https://drive.google.com/uc?export=view&id=" + file.getId();
  } catch (err) {
    console.error("saveImage_ failed for " + filename + ": " + err);
    return "";
  }
}

/** New submission from the site's form → appended as "pending". */
function doPost(e) {
  const p = e.parameter || {};
  if (p.action === "admin_login") return adminLogin_(p);
  if (p.action === "admin_save") return adminSave_(p);

  const sheet = getSheet_();

  // city_state comes in as one field. The placeholder asks for
  // "Kochi, Kerala", but people type it every which way — split on the
  // first comma or slash, whichever appears; if neither, the whole
  // thing becomes city and state is just left blank rather than
  // guessed at.
  const rawCityState = p.city_state || "";
  const sepMatch = /[,/]/.exec(rawCityState);
  const city = (sepMatch ? rawCityState.slice(0, sepMatch.index) : rawCityState).trim();
  const state = (sepMatch ? rawCityState.slice(sepMatch.index + 1) : "").trim();

  const id = Utilities.getUuid();

  const row = {
    timestamp: new Date(),
    id: id,
    status: "pending",
    name: p.name || "",
    profession: p.profession || "",
    city: city || "",
    state: state || "",
    intro: p.intro || "",
    workday: p.workday || "",
    challenge: p.challenge || "",
    dream: p.dream || "",
    quote: p.quote || "",
    interesting_object: p.interesting_object || "",
    // Base64 photos, if the person attached any, land in Drive here.
    // Blank means no photo was attached — your QA/field lead can still
    // add a link manually before approving, same as before.
    workspace_photo_url: saveImage_(p.workspace_photo_base64, id + "-workspace.jpg"),
    portrait_photo_url: saveImage_(p.portrait_photo_base64, id + "-portrait.jpg"),
    consent: p.consent === "on" ? "yes" : "no",
    latitude: p.latitude || "",
    longitude: p.longitude || ""
  };

  sheet.appendRow(COLUMNS.map((key) => row[key]));

  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      id: row.id,
      workspace_photo_saved: !!row.workspace_photo_url,
      portrait_photo_saved: !!row.portrait_photo_url,
      workspace_photo_attached: !!p.workspace_photo_base64,
      portrait_photo_attached: !!p.portrait_photo_base64
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Approved rows only → JSONP, shaped for window.TABLES.
 *  ContentService can't set an Access-Control-Allow-Origin header, so a
 *  plain fetch() from the site's own origin gets CORS-blocked no matter
 *  how this is hosted. JSONP (a <script> tag, not fetch) sidesteps that
 *  entirely — see assets/app.js's jsonp() / fetchAndMergeLiveTables(). */
function doGet(e) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const idx = (name) => headers.indexOf(name);
  const p = (e && e.parameter) || {};

  if (p.action === "admin_list") {
    if (!isAdminToken_(p.token)) return jsonResponse_({ error: "Unauthorized" }, p.callback);
    const records = values.map((row) => rowToRecord_(row, idx));
    return jsonResponse_(records, p.callback);
  }

  const approved = values
    .filter((r) => String(r[idx("status")] || "").trim().toLowerCase() === "approved")
    .filter((r) => r[idx("workspace_photo_url")] && r[idx("portrait_photo_url")]) // don't publish without photos
    .map((r) => ({
      id: r[idx("id")],
      name: r[idx("name")],
      profession: r[idx("profession")],
      city: r[idx("city")],
      state: r[idx("state")],
      photo: r[idx("workspace_photo_url")],
      portrait: r[idx("portrait_photo_url")],
      intro: r[idx("intro")],
      workday: r[idx("workday")],
      challenge: r[idx("challenge")],
      dream: r[idx("dream")],
      quote: r[idx("quote")],
      latitude: r[idx("latitude")],
      longitude: r[idx("longitude")],
      object: r[idx("interesting_object")]
        ? { label: "Interesting object", text: r[idx("interesting_object")] }
        : null
    }));

  return jsonResponse_(approved, p.callback);
}

function rowToRecord_(row, idx) {
  return {
    timestamp: row[idx("timestamp")],
    id: row[idx("id")],
    status: String(row[idx("status")] || "pending").toLowerCase(),
    name: row[idx("name")],
    profession: row[idx("profession")],
    city: row[idx("city")],
    state: row[idx("state")],
    intro: row[idx("intro")],
    workday: row[idx("workday")],
    challenge: row[idx("challenge")],
    dream: row[idx("dream")],
    quote: row[idx("quote")],
    interesting_object: row[idx("interesting_object")],
    workspace_photo_url: row[idx("workspace_photo_url")],
    portrait_photo_url: row[idx("portrait_photo_url")],
    consent: row[idx("consent")],
    latitude: row[idx("latitude")],
    longitude: row[idx("longitude")]
  };
}

function jsonResponse_(data, callback) {
  const json = JSON.stringify(data);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function adminLogin_(p) {
  const props = PropertiesService.getScriptProperties();
  const username = props.getProperty("ADMIN_USERNAME");
  const password = props.getProperty("ADMIN_PASSWORD");
  if (!username || !password) return adminMessage_({ type: "error", message: "Admin login is not configured." });
  if (p.username !== username || p.password !== password) return adminMessage_({ type: "error", message: "Invalid username or password." });
  const token = Utilities.getUuid();
  CacheService.getScriptCache().put("admin:" + token, username, 21600);
  return adminMessage_({ type: "login", token: token });
}

function adminSave_(p) {
  if (!isAdminToken_(p.token)) return adminMessage_({ type: "error", message: "Unauthorized." });
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const idx = (name) => headers.indexOf(name);
  const rowIndex = values.findIndex((row) => String(row[idx("id")]) === String(p.id));
  if (rowIndex === -1) return adminMessage_({ type: "error", message: "Submission not found." });
  const record = values[rowIndex];
  const changes = {
    status: p.approved === "on" ? "approved" : "pending",
    name: p.name || "",
    profession: p.profession || "",
    city: p.city || "",
    state: p.state || "",
    intro: p.intro || "",
    workday: p.workday || "",
    challenge: p.challenge || "",
    dream: p.dream || "",
    quote: p.quote || "",
    interesting_object: p.interesting_object || "",
    latitude: p.latitude || "",
    longitude: p.longitude || ""
  };
  Object.keys(changes).forEach((key) => { record[idx(key)] = changes[key]; });
  sheet.getRange(rowIndex + 2, 1, 1, headers.length).setValues([record]);
  return adminMessage_({ type: "saved", id: p.id, status: changes.status });
}

function isAdminToken_(token) {
  return !!token && !!CacheService.getScriptCache().get("admin:" + token);
}

function adminMessage_(payload) {
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return HtmlService.createHtmlOutput(
    "<!doctype html><script>window.top.postMessage(" + json + ", '*');</script>"
  );
}
