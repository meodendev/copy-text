import { hasDB, validCode, randomCode, pull, push } from "./storage.js";
import { copyText, shareLink } from "./clipboard.js";
import { initTheme } from "./theme.js";
import { openQR } from "./qr.js";
import { t as tr, getLang, applyLang, toggleLang } from "./i18n.js";

const $ = (id) => document.getElementById(id);

// ---- Toast (one at a time) ----
let hideT, popT;
function toast(msg) {
  const t = $("toast");
  clearTimeout(hideT); clearTimeout(popT);
  t.textContent = msg;
  if (t.showPopover && !t.matches(":popover-open")) t.showPopover();
  requestAnimationFrame(() => t.classList.add("show"));
  hideT = setTimeout(() => {
    t.classList.remove("show");
    popT = setTimeout(() => t.hidePopover && t.hidePopover(), 220);
  }, 2500);
}

// ---- Mobile menu (document listeners exist only while open) ----
const nav = $("menu"), mb = $("menu-btn");
function onDoc(e) {
  if (e.type === "keydown") { if (e.key === "Escape") { setMenu(false); mb.focus(); } }
  else if (!e.target.closest("#menu-btn")) setMenu(false);
}
function setMenu(open) {
  nav.classList.toggle("open", open);
  mb.setAttribute("aria-expanded", open);
  mb.setAttribute("aria-label", tr(open ? "menuC" : "menuO"));
  mb.textContent = open ? "✕" : "☰";
  const f = open ? "addEventListener" : "removeEventListener";
  document[f]("click", onDoc);
  document[f]("keydown", onDoc);
}
mb.addEventListener("click", () => setMenu(!nav.classList.contains("open")));

// ---- Clipboard (text is only ever written via .value / textContent) ----
const codeEl = $("code"), clip = $("clip"), max = CONFIG.MAX_TEXT_LENGTH;
$("max").textContent = max.toLocaleString();
clip.maxLength = max;
codeEl.maxLength = CONFIG.MAX_CODE_LENGTH;

const count = () => { $("count").textContent = clip.value.length.toLocaleString(); };
const link = (c) => location.origin + location.pathname + "?c=" + c;
const mark = (c) => history.replaceState(null, "", "?c=" + c);

function ago(v) {
  const d = new Date(v), s = (Date.now() - d) / 1000;
  if (isNaN(d)) return "";
  if (s < 60) return tr("a_now");
  if (s < 3600) return Math.floor(s / 60) + tr("a_min");
  if (s < 86400) return Math.floor(s / 3600) + tr("a_h");
  return d.toLocaleDateString(getLang());
}
let lastU;
const setUpdated = (u) => { lastU = u; $("updated").textContent = u ? tr("upd") + ago(u) : ""; };

function needCode() {
  const c = codeEl.value.trim().toLowerCase();
  if (validCode(c)) return c;
  toast(tr("t_code"));
  return null;
}
function ready() {
  if (hasDB()) return true;
  toast(tr("t_db"));
  return false;
}

let busy = false;
async function run(fn) {
  if (busy) return;
  busy = true;
  try { await fn(); } catch { toast(tr("t_net")); } finally { busy = false; }
}

const acts = {
  save: () => run(async () => {
    const c = needCode();
    if (!c || !ready()) return;
    await push(c, clip.value);
    mark(c); setUpdated(Date.now()); toast(tr("t_saved"));
  }),
  pull: () => run(async () => {
    const c = needCode();
    if (!c || !ready()) return;
    const d = await pull(c);
    if (!d || typeof d.t !== "string") return toast(tr("t_none"));
    clip.value = d.t; count(); mark(c); setUpdated(d.u); toast(tr("t_pulled"));
  }),
  async copy() { toast((await copyText(clip.value)) ? tr("t_copied") : tr("t_noclip")); },
  async paste() {
    try { clip.value = (await navigator.clipboard.readText()).slice(0, max); count(); }
    catch { toast(tr("t_noclip")); }
  },
  newcode() { codeEl.value = randomCode(); codeEl.focus(); },
  async share() {
    const c = needCode();
    if (!c) return;
    const r = await shareLink(link(c), "ClipSync");
    if (r === "copied") toast(tr("t_link"));
    else if (r === "fail") toast(tr("t_noclip"));
  },
  qr() { const c = needCode(); if (c) openQR($("qr-dlg"), $("qr-box"), toast, link(c)); },
  async copylink() {
    const c = needCode();
    if (c) toast((await copyText(link(c))) ? tr("t_link") : tr("t_noclip"));
  }
};

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-a],[data-close]");
  if (b) {
    if (b.dataset.a) { if (acts[b.dataset.a]) acts[b.dataset.a](); }
    else b.closest("dialog").close();
    return;
  }
  const d = e.target;
  if (d.tagName === "DIALOG" && "x" in d.dataset) {
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  }
});
clip.addEventListener("input", count);
codeEl.addEventListener("keydown", (e) => { if (e.key === "Enter") acts.pull(); });

// ---- Init ----
const refreshTheme = initTheme($("theme-btn"));
const refresh = () => {
  applyLang();
  refreshTheme();
  mb.setAttribute("aria-label", tr(nav.classList.contains("open") ? "menuC" : "menuO"));
  setUpdated(lastU);
};
$("lang-btn").addEventListener("click", () => { toggleLang(); refresh(); });
refresh();
$("year").textContent = new Date().getFullYear();
const q = (new URLSearchParams(location.search).get("c") || "").toLowerCase();
codeEl.value = validCode(q) ? q : randomCode();
count();
if (validCode(q) && hasDB()) acts.pull();
