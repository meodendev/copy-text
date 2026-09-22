const D = {
  en: {
    title: "ClipSync — Your clipboard, everywhere",
    home: "Home", features: "Features", how: "How it works", privacy: "Privacy",
    h1a: "Your clipboard,", h1b: "everywhere.",
    sub: "Share text between your devices instantly — simple, fast and lightweight.",
    code: "Code", text: "Text", ph: "Type or paste text here…", chars: " characters", newcode: "Generate new code",
    save: "Save", pull: "Pull", copy: "Copy", paste: "Paste", share: "🔗 Share", qr: "▣ QR",
    f1b: "Copy in one tap", f1p: "Open the page on any device and copy the text.",
    f2b: "Share by link or QR", f2p: "Send the link or scan the QR code on another phone.",
    f3b: "No login", f3p: "Pick a code, save text, then open the same code anywhere.",
    s1b: "1. Save", s1p: "Type text, choose a code and tap Save.",
    s2b: "2. Share the code", s2p: "Send the code, link or QR to your other device.",
    s3b: "3. Pull", s3p: "Enter the code there, tap Pull, then Copy.",
    pvp: "No account and no tracking. Saved text is stored in a cloud database under your code, and anyone who knows the code can read or overwrite it. Use a long random code and don't store secrets.",
    qrt: "Share QR", qrl: "QR code for this clipboard", copylink: "Copy Link", close: "Close",
    conflictT: "⚠ Someone else already saved", conflictP: "This code was updated by someone else after you last pulled it. Save anyway and overwrite their text?", overwrite: "Overwrite", cancel: "Cancel",
    menuO: "Open menu", menuC: "Close menu", theme: "Theme", lang: "Language",
    t_saved: "✓ Saved", t_pulled: "✓ Pulled", t_copied: "✓ Copied!", t_link: "✓ Link copied!",
    t_noclip: "⚠ Clipboard unavailable", t_net: "⚠ Network error", t_db: "⚠ Set DB_URL in config.js",
    t_none: "✕ Nothing saved under this code", t_code: "✕ Code: a-z, 0-9, - or _", t_qr: "⚠ QR unavailable",
    a_now: "a few seconds ago", a_min: " min ago", a_h: " h ago", upd: " · Updated "
  },
  vi: {
    title: "ClipSync — Clipboard của bạn, ở mọi nơi",
    home: "Trang chủ", features: "Tính năng", how: "Cách dùng", privacy: "Riêng tư",
    h1a: "Clipboard của bạn,", h1b: "ở mọi nơi.",
    sub: "Chia sẻ văn bản giữa các thiết bị ngay lập tức — đơn giản, nhanh và nhẹ.",
    code: "Mã", text: "Nội dung", ph: "Nhập hoặc dán nội dung vào đây…", chars: " ký tự", newcode: "Tạo mã mới",
    save: "Lưu", pull: "Lấy", copy: "Sao chép", paste: "Dán", share: "🔗 Chia sẻ", qr: "▣ QR",
    f1b: "Sao chép một chạm", f1p: "Mở trang trên thiết bị bất kỳ và sao chép nội dung.",
    f2b: "Chia sẻ bằng link hoặc QR", f2p: "Gửi link hoặc quét mã QR trên điện thoại khác.",
    f3b: "Không cần đăng nhập", f3p: "Chọn mã, lưu nội dung, rồi mở cùng mã đó ở bất kỳ đâu.",
    s1b: "1. Lưu", s1p: "Nhập nội dung, chọn mã và bấm Lưu.",
    s2b: "2. Chia sẻ mã", s2p: "Gửi mã, link hoặc QR sang thiết bị khác.",
    s3b: "3. Lấy về", s3p: "Nhập mã ở đó, bấm Lấy rồi Sao chép.",
    pvp: "Không cần tài khoản, không theo dõi. Nội dung được lưu trên cơ sở dữ liệu đám mây theo mã của bạn; ai biết mã đều có thể đọc hoặc ghi đè. Hãy dùng mã dài, ngẫu nhiên và đừng lưu thông tin bí mật.",
    qrt: "Chia sẻ QR", qrl: "Mã QR của clipboard này", copylink: "Sao chép link", close: "Đóng",
    conflictT: "⚠ Người khác đã lưu rồi", conflictP: "Mã này vừa được người khác cập nhật sau lần bạn lấy về gần nhất. Vẫn lưu và ghi đè nội dung của họ?", overwrite: "Ghi đè", cancel: "Hủy",
    menuO: "Mở menu", menuC: "Đóng menu", theme: "Giao diện", lang: "Ngôn ngữ",
    t_saved: "✓ Đã lưu", t_pulled: "✓ Đã lấy về", t_copied: "✓ Đã sao chép!", t_link: "✓ Đã sao chép link!",
    t_noclip: "⚠ Không truy cập được clipboard", t_net: "⚠ Lỗi mạng", t_db: "⚠ Chưa điền DB_URL trong config.js",
    t_none: "✕ Chưa có nội dung nào với mã này", t_code: "✕ Mã: a-z, 0-9, - hoặc _", t_qr: "⚠ Không tạo được QR",
    a_now: "vài giây trước", a_min: " phút trước", a_h: " giờ trước", upd: " · Cập nhật "
  }
};
const KEY = "clipsync_lang";
let lang;
try { lang = localStorage.getItem(KEY); } catch {}
if (!D[lang]) lang = (navigator.language || "").toLowerCase().startsWith("vi") ? "vi" : "en";

export const getLang = () => lang;
export const t = (k) => D[lang][k] || D.en[k] || k;

export function applyLang() {
  document.documentElement.lang = lang;
  document.title = t("title");
  for (const e of document.querySelectorAll("[data-i]")) e.textContent = t(e.dataset.i);
  for (const e of document.querySelectorAll("[data-ip]")) e.placeholder = t(e.dataset.ip);
  for (const e of document.querySelectorAll("[data-ia]")) e.setAttribute("aria-label", t(e.dataset.ia));
  for (const e of document.querySelectorAll("[data-l]")) e.classList.toggle("on", e.dataset.l === lang);
}

export function toggleLang() {
  lang = lang === "vi" ? "en" : "vi";
  try { localStorage.setItem(KEY, lang); } catch {}
}
