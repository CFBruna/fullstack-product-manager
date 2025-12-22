# 📦 Fullstack Product Management System

> ⚠️ **LICENSE WARNING**
>
> This software is the proprietary property of **Bruna Menezes**.
> Access is granted for **technical evaluation and recruitment purposes only**.
>
> 🛑 **Commercial use, modification, or distribution is strictly prohibited.**

A robust, Dockerized product management system built with **Clean Architecture** principles.

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js (Clean Architecture: Controllers, Services, Repositories)
- **Database:** MySQL + Prisma ORM
- **Validation:** Zod
- **Testing:** Jest + Supertest (Integration Tests)

### Frontend
- **Framework:** React + Vite
- **Styling:** TailwindCSS
- **State Management:** React Hooks
- **HTTP Client:** Axios

### DevOps
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions (Linting & Testing)

## 🛠 Development Guidelines (Workflow)

This project follows strict engineering standards:

1.  **Conventional Commits:** All commits must follow the convention (e.g., `feat: add product service`, `fix: validation error`).
2.  **Git Flow:**
    - `main`: Production-ready code.
    - `develop`: Integration branch.
    - Feature branches must be merged into `develop` via Pull Request.
3.  **Quality Gate:**
    - Linting (ESLint/Prettier) and Tests must pass before merging.

## 🏃‍♂️ How to Run

### Prerequisites
- Docker & Docker Compose

### Quick Start
```bash
# Clone the repository
git clone [https://github.com/CFBruna/fullstack-product-manager.git](https://github.com/CFBruna/fullstack-product-manager.git)

# Start everything (Database + Backend + Frontend)
docker-compose up --build
```

Copyright © 2025 Bruna Menezes. All Rights Reserved.