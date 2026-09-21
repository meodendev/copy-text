const K = { c: "clipsync_content", u: "clipsync_updated_at", s: "clipsync_unlocked" };
const safe = (f) => { try { return f(); } catch { return null; } };

export const getContent = () => safe(() => localStorage.getItem(K.c)) ?? CLIPBOARD_DATA.content;
export const getUpdated = () => safe(() => localStorage.getItem(K.u)) || CLIPBOARD_DATA.updatedAt;

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
