# CI/CD Pipeline Documentation

## 📋 Overview

This project uses **GitHub Actions** for automated testing, building, and deployment.

---

## 🔧 Workflows

### 1. **CI - Lint, Test & Build** (`ci.yml`)

**Triggers:**
- Push to `develop` or `main`
- Pull requests to `develop` or `main`

**Jobs:**

#### Backend CI
- Checkout code
- Install Node.js 20
- Install dependencies (`npm ci`)
- Run ESLint (`npm run lint`)
- Run tests (`npm run test`)
- Build TypeScript (`npm run build`)

#### Frontend CI
- Checkout code
- Install Node.js 20
- Install dependencies (`npm ci`)
- Run ESLint (`npm run lint`)
- Run unit tests (`npm run test`)
- Build Vite (`npm run build`)
- Upload build artifacts

#### E2E Tests
- Install Playwright
- Run E2E tests (`npm run test:e2e`)
- Upload test reports

#### Docker Build
- Build backend Docker image
- Build frontend Docker image
- Test containerization

---

### 2. **Deploy Frontend to Netlify** (`deploy-frontend.yml`)

**Triggers:**
- Push to `main`
- Manual trigger (`workflow_dispatch`)

**Steps:**
1. Build frontend (`npm run build`)
2. Deploy to Netlify
3. Post deployment URL

**Required Secrets:**
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

---

### 3. **Deploy Backend to Cloud Run** (`deploy-backend.yml`) - Optional

**Triggers:**
- Manual trigger only (`workflow_dispatch`)

**Steps:**
1. Authenticate to GCP
2. Build Docker image
3. Push to Google Container Registry
4. Deploy to Cloud Run

**Required Secrets:**
- `GCP_SA_KEY` (Service Account JSON)
- `GCP_PROJECT_ID`

---

## 🔑 Setting Up Secrets

### GitHub Repository Secrets

Go to: **Repository → Settings → Secrets and variables → Actions → New repository secret**

#### For Netlify Deployment:

1. **NETLIFY_AUTH_TOKEN**
   ```bash
   # Get your token from Netlify:
   # https://app.netlify.com/user/applications#personal-access-tokens
   ```

2. **NETLIFY_SITE_ID**
   ```bash
   # Get from Netlify site settings:
   # Site settings → General → Site details → Site ID
   ```

#### For Google Cloud Run (Optional):

1. **GCP_PROJECT_ID**
   ```bash
   # Your GCP project ID (e.g., my-kanban-123456)
   ```

2. **GCP_SA_KEY**
   ```bash
   # Service Account JSON key
   # Steps:
   # 1. GCP Console → IAM & Admin → Service Accounts
   # 2. Create service account with roles:
   #    - Cloud Run Admin
   #    - Storage Admin
   #    - Service Account User
   # 3. Create JSON key
   # 4. Copy entire JSON to this secret
   ```

---

## 🧪 Testing Locally

### Run CI Checks Locally

```bash
# Backend
cd backend
npm run lint
npm run test
npm run build

# Frontend
cd frontend
npm run lint
npm run test
npm run build

# E2E Tests
cd frontend
npm run test:e2e

# Docker
docker-compose build
docker-compose up -d
```

---

## 🚀 Deployment Workflow

### 1. Development
```bash
git checkout -b feature/my-feature
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

- ✅ CI runs automatically on PR
- ✅ All tests must pass before merge

### 2. Staging (develop branch)
```bash
git checkout develop
git merge feature/my-feature
git push origin develop
```

- ✅ CI runs on develop
- ✅ Preview deployments (if configured)

### 3. Production (main branch)
```bash
git checkout main
git merge develop
git push origin main
```

- ✅ CI runs
- ✅ **Auto-deploy to Netlify**
- ✅ Manual deploy to Cloud Run (optional)

---

## 📊 CI/CD Status Badges

Add to your README.md:

```markdown
![CI](https://github.com/KESHRUD/offline-kanban-board/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/KESHRUD/offline-kanban-board/actions/workflows/deploy-frontend.yml/badge.svg)
```

---

## 🐛 Troubleshooting

### CI Fails on npm ci
```bash
# Delete package-lock.json and regenerate
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
```

### Netlify Deployment Fails
- Check `NETLIFY_AUTH_TOKEN` is valid
- Verify `NETLIFY_SITE_ID` is correct
- Ensure build command is `npm run build`
- Publish directory must be `dist`

### Cloud Run Deployment Fails
- Verify GCP service account has correct permissions
- Check Docker image builds locally: `docker build -f docker/Dockerfile.backend .`
- Ensure `GCP_PROJECT_ID` matches your GCP project

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Deploy Action](https://github.com/nwtgck/actions-netlify)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Playwright CI Guide](https://playwright.dev/docs/ci)

---

## 🎯 Next Steps

After setting up CI/CD:

1. [ ] Configure Netlify account and get tokens
2. [ ] Add secrets to GitHub repository
3. [ ] Test CI by creating a PR
4. [ ] Deploy to production by merging to main
5. [ ] (Optional) Set up Cloud Run for backend
6. [ ] Add status badges to README
7. [ ] Configure branch protection rules

---

**Last updated:** 2025-11-20
