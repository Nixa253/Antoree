# 🚀 Antoree User Management

> **Hệ thống quản lý người dùng** gồm **Backend (Laravel)** & **Frontend (React)**, triển khai bằng **Docker**, hỗ trợ **CI/CD** với Jenkins & Render.

---

## 🏗️ Kiến trúc dự án

| Thư mục / File         | Mô tả                                    |
| ---------------------- | ---------------------------------------- |
| **backend/**           | Laravel API (PHP)                        |
| **frontend/**          | React (TypeScript)                       |
| **docker-compose.yml** | Orchestration backend, frontend, Jenkins |
| **Jenkinsfile**        | Pipeline CI/CD build, deploy tự động     |
| **.env.example**       | Mẫu biến môi trường cho backend          |

---

## 💻 Yêu cầu hệ thống

- [x] **Docker & Docker Compose**
- [x] **Node.js** (nếu muốn chạy frontend ngoài Docker)
- [x] **PHP 8+** (nếu muốn chạy backend ngoài Docker)
- [x] **MySQL** (có thể dùng dịch vụ cloud hoặc bật service mysql trong docker-compose)

---

## 🚦 Hướng dẫn cài đặt & chạy ứng dụng

### 1️⃣ Clone source code

```sh
git clone <repo-url>
cd Antoree
```

### 2️⃣ Cấu hình biến môi trường

- **Backend:**  
  Sao chép `.env.example` thành `.env` trong `backend/` và chỉnh sửa thông tin DB nếu cần.
- **Frontend:**  
  Nếu sử dụng biến môi trường, tạo file `frontend/.env` theo mẫu (nếu cần).

> ⚠️ **Lưu ý:** Không commit file `.env` thật lên git (đã ignore trong `.gitignore`).

### 3️⃣ Chạy bằng Docker Compose

```sh
docker compose up --build
```

| Dịch vụ  | Địa chỉ truy cập                               |
| -------- | ---------------------------------------------- |
| Backend  | [http://localhost:9000](http://localhost:9000) |
| Frontend | [http://localhost:3000](http://localhost:3000) |
| Jenkins  | [http://localhost:8080](http://localhost:8080) |

### 4️⃣ Chạy thủ công (không dùng Docker)

#### Backend (Laravel)

```sh
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan passport:install
php artisan serve --host=0.0.0.0 --port=9000
```

#### Frontend (React)

```sh
cd frontend
npm install
npm start
```

---

## 👑 Tài khoản admin để test

- **Link giao diện FE:** [https://antoree-frontend.onrender.com]
```
Email:    antoree@example.com
Password: antoree2025
```

---

## 🔄 CI/CD & Triển khai cloud

- Pipeline Jenkins tự động build, test, deploy xem [`Jenkinsfile`].
- Tích hợp Render để deploy frontend/backend lên cloud qua webhook.

---

## 🐳 Docker & Docker Compose

- Tách biệt backend, frontend, Jenkins.
- Dữ liệu Jenkins và DB được mount volume để không mất dữ liệu khi restart.

---

## 🔐 Cấu trúc biến môi trường an toàn

- **Không commit file `.env` thật lên git.**
- Secrets/API keys chỉ cấu hình qua biến môi trường khi deploy.
- Đã ignore các file môi trường trong `.gitignore`.

---

## 🛠️ Một số lệnh hỗ trợ

- Kiểm tra danh sách user:
  ```sh
  php backend/check_users.php
  ```

---

## 🤝 Đóng góp & liên hệ

- Pull request, issue vui lòng gửi qua **Github**.

---

## 📄 License

MIT License.

---

## ✍️ Tác giả

- **NIxA**   
- luutoannghia2003@gmail.com
