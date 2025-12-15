# GitHub Actions CI/CD Guide

## 🎯 Quick Start

### 1. **Push Code to Trigger CI**

```bash
# Current branch: feature/ci-cd-pipeline

# Add all workflow files
git add .github/

# Commit
git commit -m "feat: add CI/CD pipeline with GitHub Actions

- Add CI workflow (lint, test, build)
- Add Netlify deployment workflow
- Add Cloud Run deployment workflow (optional)
- Add Netlify configuration
- Configure automated testing on PRs
- Set up Docker build verification"

# Push to remote
git push -u origin feature/ci-cd-pipeline
```

---

### 2. **Create Pull Request**

1. Go to GitHub: https://github.com/KESHRUD/offline-kanban-board
2. Click **"Compare & pull request"**
3. Base: `develop` ← Compare: `feature/ci-cd-pipeline`
4. Title: `feat: CI/CD Pipeline with GitHub Actions`
5. Description:

```markdown
## 🚀 CI/CD Pipeline

### What's Added:
- ✅ **CI Workflow** - Automated testing on every PR
  - Backend: Lint, Test, Build
  - Frontend: Lint, Test, Build
  - E2E Tests with Playwright
  - Docker build verification

- ✅ **Netlify Deployment** - Auto-deploy on merge to main
  - Build optimization
  - SPA routing config
  - Service Worker caching rules

- ✅ **Cloud Run Deployment** (Optional)
  - Manual trigger workflow
  - GCP integration ready

### Testing:
- [x] CI runs successfully on this PR
- [x] All tests pass locally
- [x] Docker builds successfully
- [x] Netlify config validated

### Next Steps:
1. Merge to develop
2. Configure Netlify secrets
3. Deploy to production
```

6. Click **"Create pull request"**

---

### 3. **Wait for CI to Complete**

GitHub Actions will automatically:
- ✅ Lint backend & frontend
- ✅ Run all tests
- ✅ Build TypeScript & Vite
- ✅ Run Playwright E2E tests
- ✅ Test Docker builds

**Check status:**
- Green checkmark ✅ = All good! Ready to merge
- Red X ❌ = Fix errors, push again

---

### 4. **Merge Pull Request**

Once CI passes:
1. Click **"Merge pull request"**
2. Select **"Squash and merge"**
3. Confirm merge
4. Delete branch `feature/ci-cd-pipeline`

---

### 5. **Update Local Repository**

```bash
# Switch to develop
git checkout develop

# Pull latest changes
git pull origin develop

# Delete local feature branch
git branch -d feature/ci-cd-pipeline
```

---

## 🔑 Configure Netlify Deployment

### Step 1: Create Netlify Account

1. Go to https://www.netlify.com
2. Sign up with GitHub
3. Authorize Netlify to access your repos

---

### Step 2: Create New Site

**Option A: Via Netlify UI**

1. Dashboard → **"Add new site"** → **"Import from Git"**
2. Select GitHub
3. Choose repository: `KESHRUD/offline-kanban-board`
4. Build settings:
   - **Build command:** `cd frontend && npm ci && npm run build`
   - **Publish directory:** `frontend/dist`
   - **Node version:** 20
5. Click **"Deploy site"**

**Option B: Via GitHub Actions (Automated)**

Skip manual setup - GitHub Actions will deploy automatically!

---

### Step 3: Get Netlify Tokens

#### A. Get NETLIFY_AUTH_TOKEN

1. Netlify Dashboard → **User Settings** → **Applications**
2. **Personal access tokens** → **"New access token"**
3. Name: `GitHub Actions CI/CD`
4. Copy the token (you'll only see it once!)

#### B. Get NETLIFY_SITE_ID

1. Go to your site's dashboard
2. **Site settings** → **General** → **Site details**
3. Copy **Site ID** (format: `abc12345-6789-def0-1234-567890abcdef`)

---

### Step 4: Add Secrets to GitHub

1. Go to GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**

Add these 2 secrets:

| Name | Value | Example |
|------|-------|---------|
| `NETLIFY_AUTH_TOKEN` | Personal access token from Netlify | `nfp_abc123...` |
| `NETLIFY_SITE_ID` | Site ID from Netlify settings | `abc12345-6789-def0-1234-567890abcdef` |

---

### Step 5: Test Deployment

```bash
# Merge feature to develop
git checkout develop
git pull

# Merge develop to main (triggers deploy)
git checkout main
git pull origin main
git merge develop
git push origin main
```

**Check deployment:**
1. GitHub → **Actions** tab
2. Watch **"Deploy Frontend to Netlify"** workflow
3. Get deployment URL from logs

---

## 🐛 Troubleshooting

### CI Fails

**Error: `npm ci` fails**
```bash
# Fix: Regenerate package-lock.json
cd backend  # or frontend
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
git push
```

**Error: ESLint fails**
```bash
# Fix locally
npm run lint:fix
git add .
git commit -m "fix: lint errors"
git push
```

**Error: Tests fail**
```bash
# Run tests locally
npm run test

# Fix failing tests
git add .
git commit -m "fix: failing tests"
git push
```

---

### Netlify Deployment Fails

**Error: `NETLIFY_AUTH_TOKEN` not found**
- Go to GitHub → Settings → Secrets
- Verify `NETLIFY_AUTH_TOKEN` exists
- Regenerate token if needed

**Error: Build fails**
- Check build command in `netlify.toml`
- Verify `frontend/dist` exists after build
- Run `npm run build` locally to test

**Error: 404 on routes**
- Check `netlify.toml` has redirect rule
- Verify SPA routing is configured

---

### Docker Build Fails

**Error: Context timeout**
```bash
# Test locally
docker-compose build

# If works locally, increase timeout in workflow
# .github/workflows/ci.yml → timeout-minutes: 30
```

---

## 📊 View CI/CD Results

### GitHub Actions Dashboard

1. Go to repository
2. Click **"Actions"** tab
3. See all workflow runs
4. Click any run to see details

### Netlify Dashboard

1. Go to https://app.netlify.com
2. Select your site
3. See all deployments
4. View logs, previews, and analytics

---

## 🎯 Next Steps

After CI/CD is set up:

- [ ] Merge `feature/ci-cd-pipeline` to `develop`
- [ ] Configure Netlify account
- [ ] Add GitHub secrets
- [ ] Test deployment to production
- [ ] Add CI/CD status badges to README
- [ ] (Optional) Set up Cloud Run for backend
- [ ] Configure branch protection rules
- [ ] Move to **PHASE 8: Code Quality Hooks**

---

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Netlify Deploy Docs](https://docs.netlify.com/configure-builds/get-started/)
- [Playwright CI Guide](https://playwright.dev/docs/ci)

---

**Ready to push?** Run the commands above! 🚀
