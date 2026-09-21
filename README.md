# ClipSync

Clipboard online kiểu clipboardify.com: chọn một **code**, lưu text, rồi mở cùng code trên thiết bị khác để lấy lại. Không cần đăng nhập. Giao diện là website tĩnh (HTML/CSS/JS thuần) chạy trên GitHub Pages; dữ liệu lưu ở Firebase Realtime Database (miễn phí), gọi bằng `fetch`, không SDK, không build.

## Tính năng
Code tự tạo hoặc tự đặt (a-z, 0-9, `-`, `_`, tối đa 64) · Save · Pull · Copy · Paste · Share · QR (tạo ngay trên trình duyệt) · Dark/Light/System · giới hạn 10.000 ký tự · text chỉ hiển thị bằng `textarea.value` (không `innerHTML`).

## Cài đặt Firebase (một lần, ~3 phút)
1. https://console.firebase.google.com → Create project → Build → **Realtime Database** → Create database.
2. Tab **Rules**, dán rồi Publish:
```
{
  "rules": {
    "clips": {
      "$code": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['t','u']) && newData.child('t').isString() && newData.child('t').val().length <= 10000"
      }
    }
  }
}
```
3. Copy URL của database (dạng `https://xxx-default-rtdb.firebaseio.com` hoặc `...firebasedatabase.app`) vào `DB_URL` trong `config.js`.

## Triển khai GitHub Pages
Upload thư mục lên repo → Settings → Pages → Deploy from branch → `main` → `/root`. Không cần npm hay Node.js. Chạy thử trên máy: dùng static server (ES modules không chạy từ `file://`).

## Cách dùng
Thiết bị A: nhập text → chọn code → Save. Thiết bị B: nhập code → Pull (hoặc mở link/QR có `?c=code`, trang tự Pull) → Copy.

## Bảo mật và giới hạn
Không có đăng nhập: **ai biết code đều đọc và ghi đè được**, giống clipboardify. Rules trên không cho liệt kê danh sách code. Dùng code dài, ngẫu nhiên nếu cần riêng tư, và đừng lưu dữ liệu bí mật. Dữ liệu không tự xóa; ghi đè bằng lần Save mới. Firebase gói miễn phí có giới hạn dung lượng/băng thông.

## Custom domain
Settings → Pages → Custom domain, trỏ DNS theo hướng dẫn GitHub, bật Enforce HTTPS.

## Troubleshooting
- "Set DB_URL in config.js": chưa điền `DB_URL`.
- "Network error": sai URL, Rules chưa Publish, hoặc mạng chậm (timeout 8 giây).
- "Nothing saved under this code": code chưa từng Save.
- Copy/Paste không chạy: cần HTTPS và thao tác trực tiếp của người dùng.
- QR không hiện: cần mạng để tải thư viện QR nhỏ (cdnjs, version cố định) lần đầu.
