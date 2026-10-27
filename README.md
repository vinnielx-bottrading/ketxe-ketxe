# KẸT XE RỒI! — City Alive v0.6 (Donation UI)

## Điểm mới
- Sau khi thắng màn: popup 2 cột, thông tin sao/lượt/nhiệm vụ tiếp theo ở trái và thẻ ủng hộ ở phải.
- Chọn 20.000 / 50.000 / 100.000 / 200.000 / 1.000.000 VNĐ: mã VietQR EMV có số tiền tương ứng được tạo sẵn offline.
- Tùy ý: để trống quét QR không gắn số tiền; nếu nhập số tiền khác 5 mức cố định, mã QR vẫn không gắn số tiền và thông báo phải nhập tiền trong app ngân hàng. Tránh gây hiểu lầm rằng mã đã chứa số tiền tùy ý.
- Tài khoản Vietcombank, chủ tài khoản và nội dung chuyển khoản theo ảnh người dùng cung cấp.
- Không có xác minh thanh toán hoặc thu thập dữ liệu người ủng hộ; không bắt buộc đóng góp để chơi tiếp.
- Giữ 5 màn v0.5, sprites, nhạc và logic gameplay.

## File
- `index.html`: bản có cấu trúc assets tương đối, mở từ thư mục giải nén.
- File `KXR_CityAlive_v06_Choi_Ngay.html` nằm ngoài ZIP: bản HTML standalone có ảnh/nhạc nhúng.
- `game.js`: thêm lệnh mở popup sau thắng và đóng khi tải màn mới.

## Kiểm tra
- QR VietQR EMV theo chuẩn chuyển khoản nội địa (BIN Vietcombank 970436, số tài khoản 0111000182684); payload có CRC16.
- Chưa thể xác nhận ngân hàng thực tế sẽ đọc đúng số tiền và nội dung nếu chưa quét thử trên app ngân hàng; **không chuyển khoản thử nếu chưa kiểm tra kỹ thông tin**.
- Bản game giữ nguyên lời giải, kiểm tra vật lý từ v0.5.
