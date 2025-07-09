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
- `GET /api/category/search?tenDM=Tiểu thuyết` — Tìm kiếm
- `GET /api/category/:id` — Lấy chi tiết
- `POST /api/category` — Tạo mới
- `PATCH /api/category/:id` — Cập nhật thông tin
- `DELETE /api/category/:id` — Xóa
- `PATCH /api/category/:id/inactivate` — Vô hiệu hóa
- `PATCH /api/category/:id/restore` — Kích hoạt lại

### 🏢 Nhà xuất bản (Publisher)

- `GET /api/Nxb` — Lấy danh sách
- `GET /api/Nxb/search` — Tìm kiếm
- `GET /api/Nxb/:id` — Lấy chi tiết
- `POST /api/Nxb/` — Tạo mới
- `PATCH /api/Nxb/:id` — Cập nhật
- `DELETE /api/Nxb/:id` — Xóa
- `PATCH /api/Nxb/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/Nxb/:id/restore` — Kích hoạt lại

### 🏢 NGÔN NGỮ (LANGUAGE)

- `GET /api/language` — Lấy danh sách
- `GET /api/language/search` — Tìm kiếm
- `GET /api/language/:id` — Lấy chi tiết
- `POST /api/language/` — Tạo mới
- `PATCH /api/language/:id` — Cập nhật
- `DELETE /api/language/:id` — Xóa
- `PATCH /api/language/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/language/:id/restore` — Kích hoạt lại

### 🏢 SÁCH CHI TIẾT (BOOK DETAILS)

- `GET /api/SachCT` — Lấy danh sách
- `GET /api/SachCT/search` — Tìm kiếm
- `GET /api/SachCT/:id` — Lấy chi tiết
- `POST /api/SachCT/` — Tạo mới
- `PATCH /api/SachCT/:id` — Cập nhật
- `DELETE /api/SachCT/:id` — Xóa
- `PATCH /api/SachCT/:id/inactivate` — Ngưng hoạt động
- `PATCH /api/SachCT/:id/restore` — Kích hoạt lại

## ⚙️ Cài đặt & chạy dự án

```bash
# Cài đặt package
npm,yarn install

# Tạo file .env
cp .env.example .env

# Chạy ứng dụng
yarn dev
