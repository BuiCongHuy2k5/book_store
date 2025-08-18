📚 Bookstore Management API

Hệ thống RESTful API hỗ trợ quản lý sách, tác giả, danh mục và nhà xuất bản. Được xây dựng với Node.js, TypeScript và TypeORM, hỗ trợ chuẩn hóa mã nguồn, dễ mở rộng và bảo trì.

🚀 Công nghệ sử dụng

Node.js + TypeScript

Express + routing-controllers

TypeORM (ORM cho SQL Server)

SQL Server (Hệ quản trị cơ sở dữ liệu)

class-validator, class-transformer

typedi (Dependency Injection)

winston (logging)

ioredis (cache Redis - optional)

📂 Cấu trúc thư mục

SRC/
│
├── controllers/ # REST Controllers
├── services/ # Business Logic
├── repositories/ # Giao tiếp DB (TypeORM)
├── entities/ # Entity TypeORM (SQL Server)
├── types/ # DTOs (Request / Response / Input)
├── enums/ # Enum dùng chung (vd: RestRoles)
├── middlewares/ # Các middleware chung
├── libs/ # Cấu hình app, logger, env, helper
└── index.ts # Điểm khởi động ứng dụng

✅ Chức năng API đã làm kèm validation và nghiệp vụ đặc biệt

📘 Quản lý Sách (Book)

GET /api/book — Lấy danh sách sách (có phân trang)

GET /api/book/search?maSach=...&tenSach=... — Tìm kiếm theo mã hoặc tên sách

GET /api/book/:id — Lấy chi tiết sách theo ID

POST /api/book — Thêm sách mới

⚠️ Kiểm tra trùng maSach

⚠️ Kiểm tra tồn tại danh mục/tác giả

PATCH /api/book/:id — Cập nhật thông tin sách (partial update)

✅ Chỉ cập nhật field được truyền vào

⚠️ Kiểm tra nếu cập nhật maSach trùng với mã đã tồn tại

DELETE /api/book/:id — Xóa logic (chuyển STATUS về INACTIVE)

PATCH /api/book/:id/inactivate — Đổi trạng thái về INACTIVE

PATCH /api/book/:id/restore — Kích hoạt lại sách

✅ Tính năng Tổng hợp giá trị nếu sách có nhiều bản giá/phiên bản

✅ Tính năng cảnh báo không tìm thấy nếu ID không tồn tại

👤 Quản lý Tác giả (Author)

Các API tương tự Book

Tìm kiếm theo maTacGia, tenTacGia

Check trùng mã khi tạo

Cho phép cập nhật từng phần

🗂️ Quản lý Danh mục (Category)

Các API tương tự Author

Search theo tên danh mục

Cảnh báo trùng tên hoặc ID không tồn tại khi sửa

🏢 Quản lý Nhà xuất bản (Publisher)

Các API tương tự Category

Cho phép tìm kiếm, tạo mới, cập nhật, xóa mềm, khôi phục

💻 Quản lý Tài khoản (Account)

POST /api/Account — Đăng ký tài khoản mới

⚠️ Check trùng email, username

⚠️ Hash password bằng bcrypt

PATCH /api/Account/:id — Đổi mật khẩu, cập nhật info

✅ Kiểm tra password cũ trước khi đổi (nếu cần)

GET /api/Account/search — Tìm kiếm theo email, role

💆 Quản lý Khách hàng (Customer)

POST /api/Customer — Thêm khách hàng mới

✅ Kiểm tra trùng SĐT hoặc email

Cho phép chỉnh sửa từng phần, xóa mềm, khôi phục

🕴️ Quản lý Nhân viên (Employee)

Các chức năng tương tự Customer

Phân biệt ROLE = EMPLOYEE, phân quyền

🛒 Quản lý Giỏ hàng (Cart)

GET /api/Cart — Lấy toàn bộ giỏ hàng

GET /api/Cart/:id — Lấy chi tiết từng giỏ

POST /api/Cart — Tạo mới giỏ hàng

✅ Tự tính totalAmount = price \* quantity

⚠️ Kiểm tra trùng sách trong giỏ để cộng dồn hoặc báo lỗi

PATCH /api/Cart/:id — Cập nhật số lượng hoặc giá

✅ Tự động cập nhật lại totalAmount

🧾 Hóa đơn (Invoice)

Quản lý chi tiết từng đơn hàng

Tính tổng tiền, trạng thái đơn hàng

Cho phép cập nhật trạng thái đơn, PENDING / PAID

📦 Quản lý tồn kho (Inventory)

Thêm mới, cập nhật số lượng sách còn lại

Cho phép tìm kiếm theo mã sách hoặc tên

Cảnh báo tồn kho theo số lượng

Thông báo Warning theo status LOW_STOCK/OVER_STOCK/IN_STOCK/OUT_OF_STOCK

⚙️ Cài đặt & chạy dự án

# Cài đặt package

npm install

# Tạo file .env từ mẫu

cp .env.example .env

# Chạy ứng dụng ở dev mode

npm run dev

🎉 Ghi chú:

Tất cả lỗi và cảnh báo đều chuẩn hóa qua middleware ErrorHandler

Logger sử dụng Winston ghi lại toàn bộ lỗi quan trọng

Mã nguồn đã tách riêng Controller-Service-Repository theo chuẩn Clean Architecture

Tự động validate request thông qua class-validator

Mỗi entity đều có enum STATUS: ACTIVE, INACTIVE, DELETED để hỗ trợ soft delete
