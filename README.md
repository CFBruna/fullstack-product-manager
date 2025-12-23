# 📦 Fullstack Product Management System

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Available-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Coverage](https://img.shields.io/badge/Coverage-94%25-success?style=for-the-badge&logo=vitest&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-Clean-FF6B6B?style=for-the-badge)

> ⚠️ **LICENSE WARNING**
>
> This software is the proprietary property of **Bruna Menezes**.
> Access is granted for **technical evaluation and recruitment purposes only**.
>
> 🛑 **Commercial use, modification, or distribution is strictly prohibited.**

A robust, enterprise-grade Product Management System engineered with **SOLID principles** and **Clean Architecture**. This project goes beyond the standard CRUD requirements to demonstrate capabilities in building scalable, secure, and maintainable software.

> 🚀 **Live Demo:** [https://product-manager.brunadev.com](https://product-manager.brunadev.com)
>
> **Production Access Points:**
> *   📄 **Swagger Docs:** [https://product-manager.brunadev.com/api/api-docs/](https://product-manager.brunadev.com/api/api-docs/)
> *   📦 **Product List (JSON):** [https://product-manager.brunadev.com/api/products](https://product-manager.brunadev.com/api/products)
> *   🏥 **API Health:** [https://product-manager.brunadev.com/api/](https://product-manager.brunadev.com/api/)

## 📸 Preview
<p align="center">
  <img src="https://github.com/user-attachments/assets/d776d800-1c1b-4e67-aba0-73eadd37d5a2" alt="Login & Hint" width="100%" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/2b8476e5-d8ba-4aa8-905b-058d5af9571a" alt="Dashboard & Product List" width="100%" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/5da0b10a-6273-4125-a69b-91d1b45377b3" alt="Delete Confirmation" width="100%" />
</p>

## ✨ Key Features
*   **Authentication:** Secure Login/Register with JWT & BCrypt.
*   **Product Management:** Full CRUD (Create, Read, Update, Delete) with validation.
*   **Responsive UI:** Optimized layout for both Desktop (Data Tables) and Mobile (Cards).
*   **Security:** Protected routes, JWT Interceptors, and CORS configuration.

## 🏗️ Architecture & Engineering
This project implements a strict separation of concerns, ensuring code maintainability and testability.

### Backend (Clean Architecture)
The API Layer is decoupled from business logic:
1.  **Controllers** (`src/controllers`): Handle HTTP requests/responses and Zod validation.
2.  **Services** (`src/services`): Contain business rules and data processing (Authentication, CRUD logic).
3.  **Repositories** (`src/repositories`): Strict Data Access Layer using Prisma ORM.

### Frontend (Mobile-First)
- **Responsive Strategy**: Dual-layout system (Table for Desktop, Cards for Mobile) implemented via TailwindCSS utilities (`hidden md:block`).
- **State Management**: React `Context API` + `localStorage` persistence for secure Session Handling.
- **Security**: Centralized Axios interceptors for handling Bearer Tokens and global error boundaries.

---

## 📊 Quality Assurance (Verified)

| Scope | Framework | Coverage | Details |
| :--- | :--- | :--- | :--- |
| **Backend** | Jest + Supertest | **~98%** | Comprehensive Unit Testing covering Auth, Product flows, and Error Middleware. |
| **Frontend** | Vitest + RTL | **~94%** | Unit Tests for Components, Forms, and Contexts. 100% coverage on core lists. |

---

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js 20 + TypeScript 5
- **Framework:** Express.js (Clean Architecture)
- **Database:** MySQL 8 + Prisma ORM
- **Auth:** JWT + BCrypt
- **Validation:** Zod
- **Documentation:** Swagger/OpenAPI v3

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** TailwindCSS
- **State Management:** React Hooks + Context API
- **Testing:** Vitest + React Testing Library

### DevOps
- **Containerization:** Docker & Docker Compose (Multi-stage builds `node:20-slim`)
- **Orchestration:** NPM Workspaces (Root scripts)

---

## 🏃‍♂️ How to Run

### 🔐 Admin Credentials
The system comes pre-seeded with an admin user for reviewing restricted features (Edit/Delete):
- **User:** `admin@teste.com`
- **Pass:** `123456`

### 💻 Development Setup (Hybrid Mode)
We utilize a **Hybrid Workflow** for the best Developer Experience (DX):
*   **Infrastructure (MySQL):** Runs in Docker (Isolated & Consistent).
*   **Applications (Front/Back):** Run on Host (Faster Hot-Reload & Debugging).

#### Step 1: Start Infrastructure
Start the Database services using Docker:
```bash
docker compose up -d
```
> **Services Started:**
> *   **MySQL Database:** Port 3306
> *   **Adminer (DB GUI):** [http://localhost:8080](http://localhost:8080) (System: MySQL, Server: db, User: root, Pass: root)

#### Step 2: Start Applications
In a new terminal, setup environment and start the applications:

```bash
# 1. Install Dependencies (Root)
npm install

# 2. Setup Environment Variables (Crucial!)
cp backend/.env.example backend/.env

# 3. Setup Database (Apply Schema & Seeds)
cd backend && npx prisma migrate dev && npx prisma db seed && cd ..

# 4. Run Backend & Frontend concurrently
npm run dev
```
> **Access Points:**
> *   **Frontend Application:** [http://localhost:3000](http://localhost:3000)
> *   **API Documentation:** [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

---

## 🛠 Developer Workflow & Commands

This monorepo uses NPM workspaces-style root scripts for seamless management.

```bash
# Run ALL Tests (Backend Integration + Frontend Unit)
npm test

# Generate Coverage Reports
npm run test:coverage

# Run Linting (ESLint) - Zero Tolerance Policy
npm run lint
```

Copyright © 2025 Bruna Menezes. All Rights Reserved.