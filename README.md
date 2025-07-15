# 📚 Bookstore Management API

Hệ thống RESTful API hỗ trợ quản lý sách, tác giả, danh mục và nhà xuất bản. Được xây dựng với Node.js, TypeScript và TypeORM, hỗ trợ chuẩn hóa mã nguồn, dễ mở rộng và bảo trì.

## 🚀 Công nghệ sử dụng

- **Node.js** + **TypeScript**
- **Express** + **routing-controllers**
- **TypeORM** (ORM cho SQL Server)
- **SQL Server** (Hệ quản trị cơ sở dữ liệu)
- **class-validator**, **class-transformer**
- **typedi** (Dependency Injection)
- **winston** (logging)
- **ioredis** (cache Redis - optional)

## 📂 Cấu trúc thư mục

## SRC/
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


## 🧪 Chức năng API chính

### 📘 Sách (Book)

- `GET /api/book` — Lấy danh sách sách
- `GET /api/book/search?maSach=S001&tenSach=abc` — Tìm kiếm theo mã/tên
- `GET /api/book/:id` — Lấy chi tiết sách
- `POST /api/book` — Thêm sách mới
- `PATCH /api/book/:id` — Cập nhật thông tin sách (partial)
- `DELETE /api/book/:id` — Xóa sách (logic)
- `PATCH /api/book/:id/inactivate` — Chuyển sách về trạng thái INACTIVE
- `PATCH /api/book/:id/restore` — Kích hoạt lại (ACTIVE)

### 👤 Tác giả (Author)

- `GET /api/authors` — Lấy danh sách tác giả
- `GET /api/authors/search?maTacGia=TG001` — Tìm kiếm theo mã/tên
- `GET /api/authors/:id` — Lấy chi tiết
- `POST /api/authors` — Tạo mới
- `PATCH /api/authors/:id` — Cập nhật thông tin
- `DELETE /api/authors/:id` — Xóa
- `PATCH /api/authors/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/authors/:id/restore` — Kích hoạt lại

### 🗂️ Danh mục (Category)

- `GET /api/category` — Lấy danh sách danh mục
- `GET /api/category/search?tenDM=Tiểu thuyết` — Tìm kiếm theo tên/mã
- `GET /api/category/:id` — Lấy chi tiết
- `POST /api/category` — Tạo mới
- `PATCH /api/category/:id` — Cập nhật thông tin
- `DELETE /api/category/:id` — Xóa
- `PATCH /api/category/:id/inactivate` — Vô hiệu hóa
- `PATCH /api/category/:id/restore` — Kích hoạt lại

### 🏢 Nhà xuất bản (Publisher)

- `GET /api/Publisher` — Lấy danh sách
- `GET /api/Publisher/search` — Tìm kiếm
- `GET /api/Publisher/:id` — Lấy chi tiết
- `POST /api/Publisher/` — Tạo mới
- `PATCH /api/Publisher/:id` — Cập nhật
- `DELETE /api/Publisher/:id` — Xóa
- `PATCH /api/Publisher/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/Publisher/:id/restore` — Kích hoạt lại

### 🏢 TÀI KHOẢN (ACCOUNT)

- `GET /api/Account` — Lấy danh sách
- `GET /api/Account/search` — Tìm kiếm
- `GET /api/Account/:id` — Lấy chi tiết
- `POST /api/Account/` — Tạo mới
- `PATCH /api/Account/:id` — Cập nhật
- `DELETE /api/Account/:id` — Xóa
- `PATCH /api/Account/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/Account/:id/restore` — Kích hoạt lại

### 🏢 SÁCH CHI TIẾT (BOOK DETAILS)

- `GET /api/BookDetail` — Lấy danh sách
- `GET /api/BookDetail/search` — Tìm kiếm
- `GET /api/BookDetail/:id` — Lấy chi tiết
- `POST /api/BookDetail/` — Tạo mới
- `PATCH /api/BookDetail/:id` — Cập nhật
- `DELETE /api/BookDetail/:id` — Xóa
- `PATCH /api/SacBookDetailhCT/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/BookDetail/:id/restore` — Kích hoạt lại

### 🏢 KHÁCH HÀNG (CUSTOMER)

- `GET /api/Customer` — Lấy danh sách
- `GET /api/Customer/search` — Tìm kiếm
- `GET /api/Customer/:id` — Lấy chi tiết
- `POST /api/Customer/` — Tạo mới
- `PATCH /api/Customer/:id` — Cập nhật
- `DELETE /api/Customer/:id` — Xóa
- `PATCH /api/Customer/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/Customer/:id/restore` — Kích hoạt lại

### 🏢 NHÂN VIÊN (EMPLOYEE)

- `GET /api/Employee` — Lấy danh sách
- `GET /api/Employee/search` — Tìm kiếm
- `GET /api/Employee/:id` — Lấy chi tiết
- `POST /api/Employee/` — Tạo mới
- `PATCH /api/Employee/:id` — Cập nhật
- `DELETE /api/Employee/:id` — Xóa
- `PATCH /api/Employee/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/Employee/:id/restore` — Kích hoạt lại

### 🏢 ẢNH (IMAGE)

- `GET /api/Image` — Lấy danh sách
- `GET /api/Image/search` — Tìm kiếm
- `GET /api/Image/:id` — Lấy chi tiết
- `POST /api/Image/` — Tạo mới
- `PATCH /api/Image/:id` — Cập nhật
- `DELETE /api/Image/:id` — Xóa
- `PATCH /api/Image/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/Image/:id/restore` — Kích hoạt lại

### 🏢 GIỎ HÀNG (CART)

- `GET /api/Cart` — Lấy danh sách
- `GET /api/Cart/search` — Tìm kiếm
- `GET /api/Cart/:id` — Lấy chi tiết
- `POST /api/Cart/` — Tạo mới
- `PATCH /api/Cart/:id` — Cập nhật
- `DELETE /api/Cart/:id` — Xóa
- `PATCH /api/Cart/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/Cart/:id/restore` — Kích hoạt lại

### 🏢 KHUYẾN MÃI (PROMOTION)

- `GET /api/Promotion` — Lấy danh sách
- `GET /api/Promotion/search` — Tìm kiếm
- `GET /api/Promotion/:id` — Lấy chi tiết
- `POST /api/Promotion/` — Tạo mới
- `PATCH /api/Promotion/:id` — Cập nhật
- `DELETE /api/Promotion/:id` — Xóa
- `PATCH /api/Promotion/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/Promotion/:id/restore` — Kích hoạt lại

## ⚙️ Cài đặt & chạy dự án

```bash
# Cài đặt package
npm,yarn install

# Tạo file .env
cp .env.example .env

# Chạy ứng dụng
yarn dev
