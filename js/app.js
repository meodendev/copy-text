import { getContent, getUpdated } from "./storage.js";
import { copyText, shareLink } from "./clipboard.js";
import { initTheme } from "./theme.js";
import { initEditor } from "./editor.js";
import { openQR, pageUrl } from "./qr.js";

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

// ---- Render (textContent / .value only, never innerHTML) ----
function ago(v) {
  const d = new Date(v), s = (Date.now() - d) / 1000;
  if (isNaN(d)) return String(v);
  if (s < 60) return "a few seconds ago";
  if (s < 3600) return Math.floor(s / 60) + " min ago";
  if (s < 86400) return Math.floor(s / 3600) + " h ago";
  return d.toLocaleDateString();
}
function render() {
  $("clip").value = getContent();
  $("updated").textContent = "Updated " + ago(getUpdated());
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
  mb.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mb.textContent = open ? "✕" : "☰";
  const f = open ? "addEventListener" : "removeEventListener";
  document[f]("click", onDoc);
  document[f]("keydown", onDoc);
}
mb.addEventListener("click", () => setMenu(!nav.classList.contains("open")));

// ---- Actions (event delegation) ----
const editor = initEditor({ toast, render });
const acts = {
  ...editor,
  async copy() { toast((await copyText(getContent())) ? "✓ Copied!" : "⚠ Clipboard unavailable"); },
  async share() {
    const r = await shareLink(pageUrl(), "ClipSync");
    if (r === "copied") toast("✓ Link copied!");
    else if (r === "fail") toast("⚠ Clipboard unavailable");
  },
  qr() { openQR($("qr-dlg"), $("qr-box"), toast); },
  async copylink() { toast((await copyText(pageUrl())) ? "✓ Link copied!" : "⚠ Clipboard unavailable"); }
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

initTheme($("theme-btn"));
render();
$("year").textContent = new Date().getFullYear();
