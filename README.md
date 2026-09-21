# ClipSync

Website chia sẻ clipboard tĩnh: xem/copy nội dung, chia sẻ bằng link hoặc QR, muốn chỉnh sửa phải nhập mật khẩu. Không backend, không API, không database, không cần build — chạy thẳng trên GitHub Pages.

## Tính năng
- Copy, Share (Web Share API, fallback copy link), QR tạo ngay trên trình duyệt
- Modal nhập mật khẩu → editor (đếm ký tự, Clear, Reset default, Lock, Save, Cancel)
- Dark / Light / System, toast, hỗ trợ bàn phím, `prefers-reduced-motion`
- Vanilla HTML/CSS/JS, không animation liên tục, hiển thị nội dung bằng `textarea.value` / `textContent` (không dùng `innerHTML`)

## Cài đặt
Không cần `npm install` hay Node.js. Tải toàn bộ thư mục lên repository GitHub. (Muốn chạy thử trên máy, dùng một static server bất kỳ vì ES modules không chạy từ `file://`.)

## Triển khai GitHub Pages
Settings → Pages → Deploy from branch → `main` → `/root` → Save.

## Đổi password
Sửa `EDIT_PASSWORD` trong `config.js`, rồi commit và push.

## Đổi nội dung cho mọi người
Sửa `content.js` (`content`, `updatedAt`), sau đó:
```
git add .
git commit -m "Update clipboard"
git push
```

## Hành vi của localStorage
Nội dung sửa trên web được lưu vào `localStorage` (`clipsync_content`, `clipsync_updated_at`) **chỉ trên trình duyệt đó**. Nó **không đồng bộ giữa các thiết bị** và không ảnh hưởng người khác. Nếu có dữ liệu trong localStorage, nó được ưu tiên hơn `content.js`; nút Reset default xóa dữ liệu đó. Trạng thái mở khóa chỉ là một cờ trong `sessionStorage` và mất khi đóng tab; password không bao giờ được lưu.

## Giới hạn bảo mật
Vì chạy trên GitHub Pages và không có backend, password trong JavaScript **không phải bảo mật server-side thực sự**. Người xem được source repository hoặc file `config.js` có thể tìm thấy password. Hệ thống chỉ phù hợp để khóa giao diện chỉnh sửa, **không phải để bảo vệ dữ liệu bí mật**.

## Custom domain
Settings → Pages → Custom domain → nhập domain, trỏ DNS (CNAME/A) theo hướng dẫn của GitHub, bật Enforce HTTPS.

## Troubleshooting
- Trang trắng / nút không chạy: mở qua http(s), không mở bằng `file://`.
- Nội dung không đổi sau khi push: đợi 1–2 phút, hard refresh; hoặc trình duyệt đang giữ bản sửa trong localStorage (dùng Reset default).
- QR không hiện: cần mạng để tải thư viện QR nhỏ (cdnjs, version cố định) lần đầu.
- Copy không hoạt động: Clipboard API cần HTTPS và thao tác từ người dùng.
