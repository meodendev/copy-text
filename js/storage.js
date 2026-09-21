// Tiny REST client for Firebase Realtime Database (no SDK, no build step).
const base = () => CONFIG.DB_URL.replace(/\/+$/, "");
export const hasDB = () => /^https:\/\//.test(CONFIG.DB_URL);
export const validCode = (c) => /^[a-z0-9_-]+$/.test(c) && c.length <= CONFIG.MAX_CODE_LENGTH;

export function randomCode() {
  const a = new Uint8Array(6), s = "abcdefghjkmnpqrstuvwxyz23456789";
  crypto.getRandomValues(a);
  return Array.from(a, (b) => s[b % s.length]).join("");
}

async function req(code, opt) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 8000);
  try {
    const r = await fetch(base() + "/clips/" + code + ".json", { ...opt, signal: ctl.signal });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

export const pull = (code) => req(code);
export const push = (code, text) => req(code, { method: "PUT", body: JSON.stringify({ t: text, u: Date.now() }) });
