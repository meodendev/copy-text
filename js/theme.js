const KEY = "clipsync_theme";
const MODES = ["system", "light", "dark"];
const ICON = { system: "◐", light: "☀", dark: "☾" };

export function initTheme(btn) {
  let mode;
  try { mode = localStorage.getItem(KEY); } catch {}
  if (!MODES.includes(mode)) mode = "system";

  const apply = () => {
    const root = document.documentElement;
    if (mode === "system") root.removeAttribute("data-theme");
    else root.dataset.theme = mode;
    btn.textContent = ICON[mode];
    btn.setAttribute("aria-label", "Theme: " + mode + " (tap to change)");
  };

  apply();
  btn.addEventListener("click", () => {
    mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    try { localStorage.setItem(KEY, mode); } catch {}
    apply();
  });
}
