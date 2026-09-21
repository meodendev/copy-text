// Tiny client-side QR library, pinned version, loaded only when the QR modal is first opened.
const SRC = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
let loading;

const load = () => loading || (loading = new Promise((ok, fail) => {
  if (window.qrcode) return ok();
  const s = document.createElement("script");
  s.src = SRC;
  s.onload = ok;
  s.onerror = () => { loading = null; fail(); };
  document.head.appendChild(s);
}));

export async function openQR(dlg, box, toast, url) {
  try {
    await load();
    const q = window.qrcode(0, "M");
    q.addData(url);
    q.make();
    const n = q.getModuleCount(), NS = "http://www.w3.org/2000/svg";
    let d = "";
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        if (q.isDark(r, c)) d += "M" + c + " " + r + "h1v1h-1z";
    const svg = document.createElementNS(NS, "svg");
    const path = document.createElementNS(NS, "path");
    svg.setAttribute("viewBox", "-3 -3 " + (n + 6) + " " + (n + 6));
    svg.setAttribute("shape-rendering", "crispEdges");
    path.setAttribute("d", d);
    path.setAttribute("fill", "#000");
    svg.appendChild(path);
    box.replaceChildren(svg);
    dlg.showModal();
  } catch {
    toast("⚠ QR unavailable");
  }
}
