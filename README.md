# KẸT XE RỒI! — CITY ALIVE v0.5 · KHU PHỐ RIÊNG CHO MÀN 3–5

**5 màn tương tác**, giữ nguyên 2 màn đầu và nâng cấp màn 3–5.

## Các màn

| Màn | Khu vực | Nhiệm vụ | Lời giải mẫu | Luật bổ sung |
|---|---|---|---:|---|
| 1 | Ngã tư trung tâm | Cứu thương | 11 đoạn | Cơ chế chuẩn |
| 2 | Ngã tư trung tâm | Xe buýt | 13 đoạn | Cơ chế chuẩn |
| 3 | Khu kho hàng | Chuyến hàng khẩn | 14 đoạn | Khu kho, bãi container |
| 4 | Khu chợ giờ cao điểm | Giao hàng xuyên chợ | 14 đoạn | Nhánh S2B–S2P bị chặn bởi sạp |
| 5 | Công trường ven phố | Khai thông cho cứu thương | 16 đoạn | Nhánh S1B–S1P bị phong tỏa |

> **Trung thực về phạm vi:** Màn 3–5 có bối cảnh khu phố riêng, mục tiêu riêng và các giới hạn đường nhánh riêng. Cả ba **vẫn dùng khung mạng hai giao lộ chính** của v0.4, chứ chưa phải ba topology đường phố hoàn toàn khác nhau. Số đoạn là lời giải mẫu, **không phải tối ưu**.

## Công việc đã làm

- Trang trí khu kho bằng mái kho công nghiệp, bến xếp hàng, thùng hàng.
- Trang trí khu chợ bằng mái bạt sọc, quầy hàng; chặn thật đường nhánh phía đông-nam.
- Trang trí công trường bằng đường đào, rào chắn vàng-đen, cọc tiêu; chặn thật đường nhánh phía tây-nam.
- Quy tắc `closedEdges` được kiểm tra ngay trong `geometry.inspectRoute` cho mọi xe, kể cả tuyến vẽ xem trước. Chốt vẽ đường không hợp lệ không mất lượt.
- Giữ nguyên bộ sprite xe đã duyệt, đường vẽ đổi màu theo xe, UI full-browser và 2 bài nhạc nền do người dùng cung cấp.
- Mọi background chuyên biệt là các lớp SVG riêng tách khỏi collision; phần phong tỏa nhánh có dữ liệu `closedEdges` rõ ràng.
- **Chưa kết luận kiểm thử thực tế trên điện thoại:** cần nghiệm thu thao tác chạm và âm thanh trên thiết bị thật.

## File chính

- `index.html`: giao diện toàn màn hình và chọn màn.
- `district_art.js`: layer đồ họa khu vực 3–5.
- `geometry.js`: toàn thân xe, swept collision và đường cấm.
- `game.js`, `path_input.js`: vẽ tuyến, âm thanh, menu, hoàn tác, hướng dẫn, kết quả.
- `levels/mission_01..05.json`: dữ liệu màn từng nhiệm vụ.
- `test_levels_v04.js`: xác nhận lời giải mẫu; `test_closed_edges_v05.js`: xác nhận phong tỏa hiệu lực.
- `assets/vehicles/`, `assets/environment/`, `assets/audio/`: giữ asset cũ và nhạc gốc.

## Giấy phép nhạc

Hai MP3 được người dùng cung cấp. Cần xác minh nguồn phát hành và điều kiện sử dụng trước khi triển khai công khai/thương mại.

## Ghi chú phiên bản v0.4

# KẸT XE RỒI! — CITY ALIVE v0.4

**Build:** `KXR_CITY_ALIVE_COLOR_LEVELS_v04`  
**Thể loại:** Giải đố đường phố 2D top-down, chọn xe → vẽ tuyến → thả tay cho xe chạy.  
**Tình trạng:** Prototype **5 nhiệm vụ chơi được**; logic/hình học đã kiểm thử tự động, nhưng **chưa xác minh thao tác thực tế trên trình duyệt di động**.  
**Người phát triển:** Vinh Làm Game.

## 1. Thay đổi so với v0.3

- **Đường vẽ đổi màu theo từng loại xe**, đồng nhất giữa viền chọn, tuyến xem trước, chấm đích, chỉ dẫn các nút và tuyến phát sáng trong khi xe di chuyển.
- Đường hợp lệ là **nét liền màu theo xe** có viền tối và glow; đường bị chắn **đỏ đứt đoạn**, hiện lý do va chạm. Điểm này quan trọng với xe đỏ vì cả đường hợp lệ và cảnh báo đều có sắc đỏ.
- Thêm **4 nhiệm vụ City Alive**, tổng **5 nhiệm vụ** trên một bản đồ 2 ngã tư với mạng đường chung nhưng các tuyến tắc khác nhau.
- Xe ưu tiên không chỉ là cứu thương: có màn **xe buýt, xe tải, van giao hàng** đến đúng điểm đích với biển chỉ dẫn phù hợp.
- Có **chọn màn** qua ô tiêu đề ở đầu màn hình hoặc `☰ → Chọn màn chơi`, màn tiếp theo sau chiến thắng và lưu mức sao trên thiết bị.
- Giữ nguyên giao diện **chiếm toàn bộ cửa sổ trình duyệt**, bộ xe top-down, mái nhà/cây xanh tái sử dụng, nhạc nền và kiểm tra va chạm SAT trên toàn thân xe.

## 2. Các nhiệm vụ

| Màn | Tên | Xe ưu tiên | Xe hiện trên bản đồ | Lời giải mẫu (số đoạn) | Đích đến |
|---|---|---|---:|---:|---|
| 01 | Mở đường cứu thương | Xe cứu thương | 11 | 11 | Bệnh viện |
| 02 | Xe buýt trễ chuyến | Xe buýt xanh | 12 | 13 | Bến xe |
| 03 | Chuyến hàng khẩn | Xe tải nâu | 12 | 14 | Kho hàng |
| 04 | Giao hàng giờ cao điểm | Van xanh | 13 | 14 | Điểm giao |
| 05 | Hai ngã tư kẹt cứng | Xe cứu thương | 14 | 16 | Bệnh viện |

**Quan trọng:** 11/13/14/14/16 là **số đoạn của lời giải mẫu hợp lệ**, KHÔNG phải khẳng định lời giải tối ưu. Hệ thống sao hiện tính so với mốc này để test và cần điều chỉnh nếu phát hiện lời giải ngắn hơn. Một lần vuốt có thể gồm tối đa 3 đoạn; mỗi đoạn được tính một lượt.

Đây là 5 màn cùng mạng đường City Alive để nghiệm thu hệ thống, **chưa phải 5 bản đồ đô thị riêng biệt**; bối cảnh ngã tư Việt Nam được giữ nguyên có chủ đích. Các màn 2–5 bổ sung vật cản ở phía đông và/hoặc nhánh đường phía nam, khiến người chơi phải dời thêm xe trước khi mở tuyến.

## 3. Màu tuyến đường

| Sprite | Loại xe | Màu đường (HEX) |
|---|---|---|
| `01` | Sedan đỏ | `#ff6265` |
| `02` | Sedan xanh | `#55b5ff` |
| `03` | Taxi vàng | `#ffd34d` |
| `04` | SUV trắng | `#edfaff` |
| `05` | Bán tải xám | `#bfccd6` |
| `06` | Van xanh lá | `#67ef96` |
| `07` | Minibus cam | `#ffac54` |
| `08` | Xe buýt xanh | `#428cff` |
| `09` | Xe tải nâu | `#d6a06b` |
| `10` | Hatchback bạc | `#dce6ef` |
| `11` | Xe cứu thương | `#b9f6ff` |

Các màu sáng có viền tối để không chìm vào nhựa đường. Tuyến không hợp lệ ưu tiên báo **đỏ đứt nét**, bất kể màu xe.

## 4. Cách chơi

1. Tải ZIP, giải nén và mở `index.html`; hoặc dùng file HTML độc lập `KXR_CITY_ALIVE_Choi_Ngay_5_Man_v04.html` đã nhúng hình và hai MP3.
2. Bấm **BẮT ĐẦU NHIỆM VỤ**. Hai bài nhạc sẽ phát luân phiên sau một tương tác được trình duyệt cho phép.
3. Chạm giữ trên thân một xe thường → vuốt theo làn đường để vẽ tuyến → nhả ngón tay để xe chạy. Trên máy tính sử dụng chuột.
4. Đường hợp lệ màu theo xe, đường bị cản màu đỏ nét đứt. Tuyến không hợp lệ không tính lượt.
5. Vuốt nền trống để dịch camera; nhấn nút `⌖` quay về xe mục tiêu, `↶` hoàn tác một nét; menu `☰` cho gợi ý, đổi nhạc, chơi lại, Fullscreen.
6. Chạm vào **ô tên nhiệm vụ** trên thanh HUD để xem/chọn các màn đã thiết kế (prototype mở sẵn toàn bộ để tiện kiểm thử).
7. Khi thông đường, xe nhiệm vụ tự đi dọc hai giao lộ tới đúng điểm đích; nhận sao và có thể chuyển màn tiếp theo.

## 5. Cấu trúc dự án

```text
KXR_CITY_ALIVE_COLOR_LEVELS_v04/
├── index.html                  # Scene top-down toàn màn hình + UI chọn 5 màn
├── game.js                     # Chọn màn, màu xe, vẽ tuyến, âm thanh, kết quả
├── geometry.js                 # Quỹ đạo Bézier mẫu + SAT collision toàn thân
├── path_input.js               # Snap theo mạng đường, backtrack, giới hạn 3 cạnh
├── levels/
│   ├── mission_01.json ... mission_05.json
│   └── manifest.json
├── level_bundle.json           # 5 màn nhúng vào index.html để mở file cục bộ
├── assets/
│   ├── vehicles/               # H/V sprite 10 xe gốc + mẫu cứu thương
│   ├── environment/            # Mái nhà, tán cây từ bộ asset trước
│   └── audio/                  # 2 bài Lo-fi do người dùng lựa chọn
├── build_levels.py             # Định nghĩa dữ liệu màn
├── build_standalone.py         # Đóng gói thành một HTML chơi ngay
├── test_levels_v04.js          # Kiểm tra SAT, quỹ đạo, lời giải mẫu 5 màn
└── test_game_flow_v04.js       # Kiểm tra chuyển màn, hành trình thắng bằng DOM giả lập
```

## 6. Các tài nguyên đã giữ nguyên

- **10 phương tiện đã duyệt**: sedan đỏ, sedan xanh, taxi vàng, SUV trắng, bán tải xám, van xanh lá, minibus cam, xe buýt xanh, xe tải nâu, hatchback bạc; thêm `KXR_VEH_11` cứu thương từ giai đoạn City Alive.
- **Không cắt hoặc vẽ lại** các xe bằng cách tách bảng tổng hợp.
- **Hai nhạc nền** do người dùng cung cấp:
  - `jorisvermeer-smooth-lofi-beat-566127.mp3`
  - `xethrocc-playa-del-sol-latin-lofi-160149.mp3`
- Màu đường là thay đổi trong CSS/JS; không làm đổi màu sprite gốc.
- Vẫn sử dụng sprite môi trường đã tái chế từ giai đoạn MAP 01 và cấu trúc 2 ngã tư ở City Alive.

**Giấy phép nhạc:** cần lưu URL nguồn và xác minh loại giấy phép, việc sử dụng thương mại và nghĩa vụ ghi công trước khi đưa bản game lên trang web công khai. Không suy luận quyền xuất bản chỉ từ việc có MP3.

## 7. Kiểm thử

- `node test_levels_v04.js`: kiểm tra trạng thái xuất phát, từng đoạn dời xe không đè toàn thân, và xe nhiệm vụ có tuyến hợp lệ đến đích trong **cả 5 màn**.
- `node test_game_flow_v04.js`: thử logic game bằng **DOM mô phỏng**, tính lượt, chuyển màn, chiến thắng và cập nhật xe nhiệm vụ đến `HOSP` (tên node dùng chung cho các điểm đích); 5/5 màn hoàn thành.
- Hình học: SAT cho OBB, khoảng hở thiết kế 2 world px, mẫu chạy đủ nhỏ theo khoảng dịch chuyển 4 px và góc xoay 2°, kiểm tra cả quỹ đạo khi cua.
- Đã thử khởi chạy Chromium headless trong container nhưng không xuất được ảnh/chạy kiểm thử tương tác; **không khẳng định đã kiểm tra touch iPhone/Android thật**.

**Hạn chế còn lại:** mô hình bán kính lái chưa dựa trên wheelbase thực tế; chạm vào toàn bộ vùng thân xe có thể cần tối ưu trên màn rất nhỏ; phần nền hiện có giới hạn road corridor chứ chưa polygon collider chi tiết cho từng công trình; các màn mới dùng lại phần lớn chuỗi gỡ kẹt phía tây của màn 1. Đây là các việc tiếp theo cần cải tiến để tăng sự khác biệt giữa màn.

## 8. Hướng phát triển tiếp theo

1. Kiểm thử trực tiếp Chrome/Edge desktop và Android/iPhone: chọn xe màu trắng, xanh, đỏ, vàng, cản đường, camera pan, nhạc và chuyển màn.
2. Tạo **những bố cục gỡ kẹt mới thực sự khác nhau**, không chỉ thêm xe cuối tuyến, và thiết kế công cụ tìm lời giải tối ưu để cân bằng sao.
3. Mở rộng bản đồ đô thị Việt Nam thành nhánh hẻm, công trường và vòng xoay; hỗ trợ nhiệm vụ xe cứu hỏa/cảnh sát sau khi có sprite riêng được duyệt.
4. Giảm dung lượng file HTML độc lập/âm thanh và kiểm chứng giấy phép thương mại trước khi xuất bản công khai.

## 9. Lịch sử

- v0.1: nguyên mẫu hai giao lộ.
- v0.2: SAT collision và quỹ đạo xe dài.
- v0.3: chọn xe rồi vẽ đường, rút gọn HUD, nhạc tự chạy sau tương tác.
- **v0.4: màu tuyến theo xe, 4 nhiệm vụ mới, chọn màn, nút màn tiếp theo và lưu sao.**

## Kiểm thử cuối cho gói v0.5

- `node test_levels_v04.js`: PASS 5/5 nhiệm vụ, mẫu 11/13/14/14/16 đoạn, hành trình xe mục tiêu thông thoáng.
- `node test_closed_edges_v05.js`: PASS, phong tỏa S2B–S2P ở màn 4 và S1B–S1P ở màn 5 có tác dụng thật.
- `node test_game_flow_v04.js`: PASS 5/5 vòng chơi qua mô phỏng DOM, chuyển màn và trạng thái thắng.
- Chromium desktop: đã mở thực tế và chụp ảnh ở màn 3,4,5, không ghi nhận lỗi JavaScript trong lần kiểm tra này. Ảnh lưu trong `Preview_Level_03.png`, `_04.png`, `_05.png`.
- Chưa kiểm thử cảm ứng trên điện thoại thật; phải nghiệm thu trước khi công bố bản hoàn thiện.
- Các màn 3–5 có thêm đặc trưng bối cảnh và đường nhánh bị chặn, nhưng **vẫn cùng khung tuyến đường hai giao lộ**; các bản đồ có địa hình hoàn toàn khác cần phát triển ở bản sau.
