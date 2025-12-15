# Project: Offline Kanban Board

## Project Overview

This is a full-stack, offline-first Progressive Web App (PWA) Kanban board. The goal of this project is to provide a reliable and modern project management tool that works seamlessly both online and offline.

**Frontend:**
- **Framework:** React 19.2 with Vite
- **Language:** TypeScript
- **Styling:** CSS3 + CSS Variables
- **Drag & Drop:** @dnd-kit/core
- **Offline Storage:** IndexedDB via `idb` library
- **PWA/Service Worker:** `vite-plugin-pwa` and Workbox
- **Testing:** Vitest for unit tests and Playwright for E2E tests.

**Backend:**
- **Framework:** Express.js with Node.js
- **Language:** TypeScript
- **API:** RESTful API
- **Testing:** Vitest and Supertest

**DevOps:**
- **Containerization:** Docker and Docker Compose
- **CI/CD:** GitHub Actions
- **Deployment:** The frontend is deployed to Netlify and the backend to Google Cloud Run.

## Building and Running

### Prerequisites

- Node.js 20.x
- npm 10.x
- Docker (optional)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/KESHRUD/offline-kanban-board.git
    cd offline-kanban-board
    ```
2.  **Install dependencies for all workspaces:**
    ```bash
    npm install
    cd backend && npm install
    cd ../frontend && npm install
    ```

### Development

**Without Docker:**

1.  **Start the backend server:**
    ```bash
    cd backend
    npm run dev
    ```
    The backend will be available at `http://localhost:3000`.

2.  **Start the frontend development server:**
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

**With Docker:**

-   **Run in development mode (with hot-reloading):**
    ```bash
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
    ```
-   **Run in production mode:**
    ```bash
    docker-compose up
    ```

### Building for Production

-   **Build both frontend and backend:**
    ```bash
    cd backend && npm run build
    cd ../frontend && npm run build
    ```

## Testing

### Backend

-   **Run unit tests:**
    ```bash
    cd backend
    npm test
    ```
-   **Run tests with UI:**
    ```bash
    cd backend
    npm run test:ui
    ```

### Frontend

-   **Run unit tests:**
    ```bash
    cd frontend
    npm test
    ```
-   **Run End-to-End (E2E) tests:**
    ```bash
    cd frontend
    npm run test:e2e
    ```

## Development Conventions

-   **Code Style:** The project uses ESLint and Prettier for code formatting and linting.
    -   To check for linting errors, run `npm run lint` in the `frontend` or `backend` directory.
    -   To automatically fix linting errors, run `npm run lint:fix` in the `frontend` or `backend` directory.
-   **Commits:** The project follows the Conventional Commits specification.
-   **Branching:** Feature branches should be created from the `main` branch.
-   **CI/CD:** The project uses GitHub Actions for continuous integration and deployment. All pushes to `main` will trigger the CI/CD pipeline.
