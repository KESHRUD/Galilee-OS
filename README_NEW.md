# 📋 Offline Kanban Board

[![CI/CD](https://github.com/KESHRUD/offline-kanban-board/workflows/CI/badge.svg)](https://github.com/KESHRUD/offline-kanban-board/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://react.dev/)
[![PWA](https://img.shields.io/badge/PWA-enabled-5A0FC8)](https://web.dev/progressive-web-apps/)

> A production-grade Progressive Web App for task management with full offline support, built following FAANG engineering standards.

## ✨ Features

### Core Functionality
- 📱 **Progressive Web App** - Install on any device, works like a native app
- 🔄 **Offline-First** - Full functionality without internet connection
- ⚡ **Real-time Sync** - Automatic synchronization when back online
- 🎯 **Kanban Board** - Organize tasks with drag & drop
- 💾 **Local Storage** - IndexedDB for reliable offline data persistence
- 🔔 **Update Notifications** - Instant alerts when new version is available

### Technical Highlights
- 🏗️ **TypeScript** - Full type safety across frontend and backend
- 🧪 **Comprehensive Testing** - Unit tests (Vitest) + E2E tests (Playwright)
- 🔒 **Type-Safe API** - Zod validation with TypeScript inference
- 📦 **Smart Caching** - Multi-strategy caching with Workbox
- 🎨 **Responsive Design** - Works perfectly on mobile and desktop
- ⚙️ **CI/CD Ready** - Automated testing and deployment pipelines

## 🚀 Quick Start

### Prerequisites
```bash
node --version  # v18.0.0+
npm --version   # v9.0.0+
git --version   # v2.30.0+
```

### Installation

```bash
# 1. Clone repository
git clone https://github.com/KESHRUD/offline-kanban-board.git
cd offline-kanban-board

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install
```

### Development

```bash
# Terminal 1 - Backend (http://localhost:3000)
cd backend
npm run dev

# Terminal 2 - Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

# Preview production frontend
cd ../frontend
npm run preview
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## 🧪 Testing

### Unit Tests (Vitest)

```bash
cd frontend
npm test              # Run tests
npm run test:ui       # Run with UI
npm run test:coverage # Coverage report
```

**Coverage Target:** 80%+ across lines, functions, branches, statements

### E2E Tests (Playwright)

```bash
cd frontend
npm run test:e2e           # Run E2E tests
npm run test:e2e -- --ui   # Run with UI mode
npm run test:e2e -- --debug # Debug mode
```

**Browsers Tested:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

## 📁 Project Structure

```
offline-kanban-board/
├── frontend/
│   ├── public/
│   │   ├── icons/              # PWA icons
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   └── UpdatePrompt.tsx
│   │   ├── hooks/
│   │   │   ├── useOnlineStatus.ts
│   │   │   ├── useServiceWorker.ts
│   │   │   └── useTasks.ts
│   │   ├── services/
│   │   │   ├── api.ts          # API client
│   │   │   ├── db.ts           # IndexedDB
│   │   │   └── sw-registration.ts
│   │   ├── styles/
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── e2e/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── playwright.config.ts
│   ├── vitest.config.ts
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── types/
│   │   └── index.ts
│   ├── tests/
│   └── tsconfig.json
├── docs/
│   └── PWA_FEATURES.md
├── .github/
│   └── workflows/              # CI/CD pipelines
├── docker/
│   ├── backend.Dockerfile
│   └── frontend.Dockerfile
├── docker-compose.yml
└── PROJECT_PLAN.md
```

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI Framework |
| TypeScript | 5.5 | Type Safety |
| Vite | 6.0 | Build Tool |
| Workbox | 7.3 | Service Worker |
| IndexedDB (idb) | 8.0 | Offline Storage |
| @dnd-kit | 6.3 | Drag & Drop |
| Vitest | 2.1 | Unit Testing |
| Playwright | 1.56 | E2E Testing |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 5.1 | API Framework |
| TypeScript | 5.7 | Type Safety |
| Zod | 3.24 | Validation |
| Vitest | 2.1 | Testing |

### DevOps
| Technology | Purpose |
|------------|---------|
| GitHub Actions | CI/CD |
| Docker | Containerization |
| ESLint | Code Quality |
| Prettier | Code Formatting |
| Husky | Git Hooks |

## 🎯 Features Status

### ✅ Completed
- [x] Git repository setup with branch protection
- [x] Frontend setup (React + TypeScript + Vite)
- [x] Backend API (Express + TypeScript)
- [x] PWA configuration (Service Worker + Manifest)
- [x] Offline detection and status indicator
- [x] IndexedDB integration for offline storage
- [x] Update prompt UI component
- [x] Comprehensive test suite (Unit + E2E)
- [x] Smart caching strategies
- [x] Background sync configuration

### 🚧 In Progress
- [ ] Drag & Drop functionality (@dnd-kit)
- [ ] Task filtering and search
- [ ] GitHub Actions CI/CD

### 📋 Planned
- [ ] Dark mode theme
- [ ] Task priority levels
- [ ] Categories and tags
- [ ] Keyboard shortcuts
- [ ] Performance optimization
- [ ] Lighthouse score 95+

## 📊 Performance Targets

### Lighthouse Scores
- Performance: **95+**
- Accessibility: **95+**
- Best Practices: **95+**
- SEO: **95+**
- PWA: **100**

### Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## 🤝 Contributing

Contributions welcome! Please follow:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📖 Documentation

- [Project Plan](PROJECT_PLAN.md) - Detailed development roadmap
- [Setup Checklist](SETUP_CHECKLIST.md) - Step-by-step setup guide
- [PWA Features](docs/PWA_FEATURES.md) - PWA implementation details
- [Changelog](CHANGELOG.md) - Version history

## 👥 Authors

- **KESHRUD** - [GitHub](https://github.com/KESHRUD)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ following FAANG engineering standards**
