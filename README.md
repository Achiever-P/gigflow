# GigFlow - Smart Leads Dashboard

A full-stack Lead Management Dashboard built using the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. Designed with clean architecture, scalable code practices, and a professional user experience.

## 🚀 Live Demo
- **Frontend (Vercel)**: [https://gigflow-frontend.vercel.app](https://gigflow-frontend.vercel.app)
- **Backend API (Render)**: [https://gigflow-esax.onrender.com](https://gigflow-esax.onrender.com)
- **API Documentation**: See `API_DOCS.md` in the root directory.

## Features

- **Authentication & RBAC**: Secure JWT-based authentication with `bcrypt` password hashing. Role-Based Access Control supports Admin and Sales User roles.
- **Leads Management**: Full CRUD operations for managing leads.
- **Advanced Filtering & Search**: Debounced search by Name or Email, combined with multi-select filtering by Status and Source.
- **Backend Pagination**: Efficient server-side pagination (limit: 10 records per page) with skip and limit logic.
- **CSV Export**: Instantly export the currently filtered table data to a CSV file.
- **Modern UI**: Built with React, TailwindCSS, and Lucide icons. Features Dark Mode support, loading skeletons, empty states, and comprehensive form validation (via `react-hook-form` and `zod`).
- **Dockerized**: Fully containerized using Docker Compose for simple and reproducible local environments.

## Tech Stack

- **Frontend**: React (Vite), TypeScript, TailwindCSS, React Router, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Zod.
- **Infrastructure**: Docker & Docker Compose.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.

### Running Locally with Docker

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd GigFlow
   ```

2. Start the application:
   ```bash
   docker compose up -d --build
   ```

3. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`

### Running Locally without Docker

1. Ensure MongoDB is running locally on port `27017`.
2. Open a terminal for the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. Open a terminal for the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Development Requirements Satisfied
- [x] TypeScript Usage Everywhere (No Plain JavaScript)
- [x] JWT Authentication & Protected Routes
- [x] Role-Based Access Control (Admin/Sales)
- [x] Advanced Filtering & Debounced Search
- [x] Server-side Pagination
- [x] RESTful API Standards & Centralized Error Handling
- [x] Responsive Design & Dark Mode
- [x] CSV Export Functionality
