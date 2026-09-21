const RE = /^[a-z0-9_-]{1,32}$/i;
const raw = new URLSearchParams(location.search).get("c") || "main";
export const CODE = RE.test(raw) ? raw.toLowerCase() : "main";
const K = { c: "clipsync_content_" + CODE, u: "clipsync_updated_at_" + CODE, s: "clipsync_unlocked" };
const D = Object.prototype.hasOwnProperty.call(CLIPBOARD_DATA, CODE) ? CLIPBOARD_DATA[CODE] : { content: "", updatedAt: "" };
const safe = (f) => { try { return f(); } catch { return null; } };

export const getContent = () => safe(() => localStorage.getItem(K.c)) ?? D.content;
export const getUpdated = () => safe(() => localStorage.getItem(K.u)) || D.updatedAt;

export function saveContent(text) {
  return safe(() => {
    localStorage.setItem(K.c, text);
    localStorage.setItem(K.u, new Date().toISOString());
    return true;
  }) === true;
}

export function resetContent() {
  safe(() => { localStorage.removeItem(K.c); localStorage.removeItem(K.u); });
}

// Only a flag lives in sessionStorage — the password is never stored.
export const isUnlocked = () => safe(() => sessionStorage.getItem(K.s)) === "1";
export function setUnlocked(v) {
  safe(() => (v ? sessionStorage.setItem(K.s, "1") : sessionStorage.removeItem(K.s)));
}
