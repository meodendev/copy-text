import { getContent, saveContent, resetContent, isUnlocked, setUnlocked } from "./storage.js";

const $ = (id) => document.getElementById(id);

export function initEditor({ toast, render }) {
  const lock = $("lock-dlg"), ed = $("ed-dlg"), pw = $("pw"), err = $("pw-err");
  const ta = $("ed"), cnt = $("cnt"), btn = $("edit-btn"), max = CONFIG.MAX_TEXT_LENGTH;

  $("max").textContent = max.toLocaleString();
  ta.maxLength = max;

  const label = () => { btn.textContent = isUnlocked() ? "🔓 Edit" : "🔒 Edit"; };
  const count = () => { cnt.textContent = ta.value.length.toLocaleString(); };
  const openEditor = () => { ta.value = getContent(); count(); ed.showModal(); ta.focus(); };

  label();
  ta.addEventListener("input", count);
  lock.addEventListener("close", () => { pw.value = ""; err.textContent = ""; });

  $("lock-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (pw.value === CONFIG.EDIT_PASSWORD) {
      setUnlocked(true);
      lock.close();
      label();
      openEditor();
    } else {
      pw.value = "";
      err.textContent = "✕ Incorrect password";
      pw.focus();
      toast("✕ Incorrect password");
    }
  });

  return {
    edit() {
      if (isUnlocked()) openEditor();
      else { lock.showModal(); pw.focus(); }
    },
    clear() { ta.value = ""; count(); ta.focus(); },
    reset() {
      if (!isUnlocked()) return;
      resetContent(); render(); ed.close(); toast("✓ Reset to default");
    },
    lock() { setUnlocked(false); label(); ed.close(); toast("🔒 Locked"); },
    save() {
      if (!isUnlocked()) return;
      if (!saveContent(ta.value.slice(0, max))) return toast("⚠ Storage unavailable");
      render(); ed.close(); toast("✓ Changes saved");
    }
  };
}
