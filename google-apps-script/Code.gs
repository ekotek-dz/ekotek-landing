/**
 * EKOTEK landing page — form receiver
 * Saves every submission to this Google Sheet and emails the team.
 *
 * Setup (once, signed in as ekotekdz@gmail.com):
 *  1. Create a Google Sheet, then Extensions > Apps Script.
 *  2. Replace the code with this file, Save.
 *  3. Deploy > New deployment > type "Web app"
 *       Execute as: Me   ·   Who has access: Anyone
 *  4. Authorize, copy the Web app URL (ends with /exec)
 *     and paste it into assets/config.js -> FORM_ENDPOINT.
 */

var NOTIFY_EMAIL = "ekotekdz@gmail.com";

var SHEETS = {
  demo: {
    name: "Demo requests",
    cols: ["Date", "Name", "Establishment", "Type", "City", "Email", "Phone", "Meals/day", "Message", "Language", "Page"],
    keys: ["_date", "name", "establishment", "type", "city", "email", "phone", "meals", "message", "lang", "page"]
  },
  support: {
    name: "Support",
    cols: ["Date", "Kind", "Name", "Email", "Message", "Language", "Page"],
    keys: ["_date", "kind", "name", "email", "message", "lang", "page"]
  }
};

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.website) return json_({ ok: true });            // spam trap
  var cfg = SHEETS[p.form];
  if (!cfg) return json_({ ok: false, error: "unknown form" });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(cfg.name) || ss.insertSheet(cfg.name);
    if (sh.getLastRow() === 0) {
      sh.appendRow(cfg.cols);
      sh.getRange(1, 1, 1, cfg.cols.length).setFontWeight("bold");
      sh.setFrozenRows(1);
    }
    p._date = new Date();
    sh.appendRow(cfg.keys.map(function (k) { return clean_(p[k]); }));
  } finally {
    lock.releaseLock();
  }

  try { notify_(p, cfg); } catch (err) { console.error(err); }
  return json_({ ok: true });
}

function doGet() {
  return json_({ ok: true, service: "EKOTEK forms" });
}

function notify_(p, cfg) {
  var subject = p.form === "demo"
    ? "New demo request: " + (p.establishment || "?") + " (" + (p.city || "?") + ")"
    : "New support message: " + (p.kind || "?");
  var body = cfg.cols.map(function (c, i) {
    var v = cfg.keys[i] === "_date" ? new Date().toString() : (p[cfg.keys[i]] || "");
    return c + ": " + v;
  }).join("\n");
  body += "\n\nSee all submissions: " + SpreadsheetApp.getActiveSpreadsheet().getUrl();

  var opts = { to: NOTIFY_EMAIL, subject: "[EKOTEK site] " + subject, body: body };
  if (p.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) opts.replyTo = p.email;
  MailApp.sendEmail(opts);
}

function clean_(v) {
  v = (v === undefined || v === null) ? "" : v;
  if (v instanceof Date) return v;
  v = String(v).slice(0, 5000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;              // avoid formula injection
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to test: creates a row and sends you an email. */
function testSubmit() {
  doPost({ parameter: { form: "support", kind: "opinion", name: "Test", email: "", message: "Hello from the test function", lang: "en", page: "editor" } });
}
