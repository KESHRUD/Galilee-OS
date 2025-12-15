# 📋 Offline Kanban Board - PWA

![CI](https://github.com/KESHRUD/offline-kanban-board/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/KESHRUD/offline-kanban-board/actions/workflows/deploy-frontend.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20.x-green.svg)
![React](https://img.shields.io/badge/react-19.2-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.9-blue.svg)

A modern, offline-first Progressive Web App (PWA) Kanban board built with React, TypeScript, and Express.

---

## ✨ Features

### 🚀 Core Features
- ✅ **Drag & Drop** - Smooth task movement with @dnd-kit
- ✅ **Offline-First** - Works without internet connection
- ✅ **PWA** - Installable on mobile & desktop
- ✅ **Real-time Sync** - Auto-sync when back online
- ✅ **IndexedDB Storage** - Persistent local data
- ✅ **Service Worker** - Advanced caching strategies

### 🎨 UI/UX
- ✅ Modern gradient design
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Touch-friendly interface
- ✅ Accessibility compliant (ARIA labels)
- ✅ Smooth animations & transitions

### 🔧 Developer Experience
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Unit tests (Vitest)
- ✅ E2E tests (Playwright)
- ✅ Docker support
- ✅ CI/CD with GitHub Actions

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.2
- **Build Tool:** Vite 7.2
- **Language:** TypeScript 5.9
- **Drag & Drop:** @dnd-kit
- **PWA:** vite-plugin-pwa + Workbox
- **Storage:** IndexedDB (via idb)
- **Testing:** Vitest + Playwright
- **Styling:** CSS3 + CSS Variables

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express 5.1
- **Language:** TypeScript 5.9
- **Validation:** Zod
- **Security:** Helmet + CORS
- **Testing:** Vitest + Supertest

### DevOps
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Deployment:** Netlify (Frontend) + Cloud Run (Backend)
- **Code Quality:** ESLint + Prettier

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x
- npm 10.x
- Docker (optional)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/KESHRUD/offline-kanban-board.git
cd offline-kanban-board

# Install dependencies
npm install # installs root scripts
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Development

```bash
# Option 1: Run with npm
cd backend && npm run dev  # Terminal 1
cd frontend && npm run dev # Terminal 2

# Option 2: Run with Docker
docker-compose up

# Access the app
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

### Production Build

```bash
# Build with npm
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..

# Build with Docker
docker-compose build
docker-compose up -d
```

---

## 📋 Project Structure

```
offline-kanban-board/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                # CI/CD pipeline
│   │   ├── deploy-frontend.yml   # Netlify deployment
│   │   └── deploy-backend.yml    # Cloud Run deployment
│   └── CI_CD_SETUP.md            # Deployment guide
├── backend/
│   ├── src/
│   │   ├── controllers/          # Route controllers
│   │   ├── middleware/           # Express middleware
│   │   ├── routes/               # API routes
│   │   ├── types/                # TypeScript types
│   │   └── index.ts              # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   │   ├── icons/                # PWA icons
│   │   └── manifest.webmanifest  # PWA manifest
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── hooks/                # Custom hooks
│   │   ├── services/             # API & DB services
│   │   ├── styles/               # CSS files
│   │   ├── tests/                # Unit + E2E tests
│   │   ├── utils/                # Utilities
│   │   ├── App.tsx               # Main component
│   │   └── main.tsx              # Entry point
│   ├── package.json
│   ├── vite.config.ts            # Vite configuration
│   └── playwright.config.ts      # E2E test config
├── docker/
│   ├── Dockerfile.frontend       # Frontend Docker image
│   ├── Dockerfile.backend        # Backend Docker image
│   ├── nginx.conf                # Nginx config for PWA
│   └── README.md                 # Docker guide
├── docker-compose.yml            # Production orchestration
├── docker-compose.dev.yml        # Development mode
├── netlify.toml                  # Netlify configuration
└── README.md                     # This file
```

---

## 🧪 Testing

### Unit Tests

```bash
# Backend tests
cd backend
npm run test         # Run tests
npm run test:ui      # Test UI
npm run test:coverage # Coverage report

# Frontend tests
cd frontend
npm run test         # Run tests
npm run test:ui      # Test UI
```

### E2E Tests

```bash
cd frontend
npm run test:e2e     # Run Playwright tests
npx playwright show-report # View test report
```

### Linting

```bash
# Backend
cd backend
npm run lint         # Check
npm run lint:fix     # Fix

# Frontend
cd frontend
npm run lint         # Check
npm run lint:fix     # Fix
```

---

## 🐳 Docker

### Build Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend
```

### Run Containers

```bash
# Production mode
docker-compose up -d

# Development mode with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# View logs
docker-compose logs -f
```

### Stop Containers

```bash
docker-compose down
```

See [docker/README.md](docker/README.md) for detailed Docker documentation.

---

## 🚀 Deployment

### Netlify (Frontend)

Automatic deployment on push to `main`:

1. Configure secrets in GitHub:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
2. Push to `main` branch
3. GitHub Actions deploys automatically

See [.github/CI_CD_SETUP.md](.github/CI_CD_SETUP.md) for step-by-step guide.

### Cloud Run (Backend) - Optional

Manual deployment via GitHub Actions:

1. Configure GCP service account
2. Add secrets to GitHub
3. Trigger workflow manually

---

## 📚 Documentation

- [Project Plan](PROJECT_PLAN.md) - Detailed project roadmap
- [Setup Checklist](SETUP_CHECKLIST.md) - Initial setup steps
- [Docker Guide](docker/README.md) - Docker usage
- [CI/CD Setup](.github/CI_CD_SETUP.md) - Deployment guide
- [Workflows](.github/workflows/README.md) - GitHub Actions reference

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**KESHRUD**  
GitHub: [@KESHRUD](https://github.com/KESHRUD)

---

## 🙏 Acknowledgments

- React Team for React 19
- Vite Team for blazing fast builds
- @dnd-kit for drag & drop
- Workbox for PWA support
- Netlify for free hosting

---

**Built with ❤️ for PWA Advanced Programming Course**
