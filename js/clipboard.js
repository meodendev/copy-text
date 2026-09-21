export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {}
  try {
    const a = document.createElement("textarea");
    a.value = text;
    a.setAttribute("readonly", "");
    a.style.cssText = "position:fixed;top:0;opacity:0";
    (document.querySelector("dialog[open]") || document.body).appendChild(a);
    a.select();
    const ok = document.execCommand("copy");
    a.remove();
    return ok;
  } catch { return false; }
}

export async function shareLink(url, title) {
  if (navigator.share) {
    try { await navigator.share({ title, url }); return "shared"; }
    catch (e) { if (e && e.name === "AbortError") return "cancel"; }
  }
  return (await copyText(url)) ? "copied" : "fail";
}
