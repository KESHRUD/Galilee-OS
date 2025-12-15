# 🐳 Docker Guide - Offline Kanban Board

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Commands](#commands)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Production Mode (Recommended)
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access the app:**
- Frontend: http://localhost
- Backend API: http://localhost:3000/api

---

### Development Mode
```bash
# Start with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Rebuild after dependency changes
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

**Access the app:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

---

## 🏗️ Architecture

### Services

#### **Frontend** (React PWA)
- **Base Image:** `node:20-alpine` (build) + `nginx:alpine` (runtime)
- **Port:** `80` (production) / `5173` (development)
- **Build:** Multi-stage Dockerfile
- **Features:**
  - Optimized Nginx configuration
  - Service Worker support
  - Static asset caching
  - API proxy to backend
  - SPA routing

#### **Backend** (Express API)
- **Base Image:** `node:20-alpine`
- **Port:** `3000`
- **Build:** Multi-stage Dockerfile
- **Features:**
  - TypeScript compilation
  - Production-only dependencies
  - Non-root user for security
  - Health check endpoint

---

## 📦 Docker Files Structure

```
project-root/
├── docker/
│   ├── Dockerfile.frontend      # Frontend multi-stage build
│   ├── Dockerfile.backend       # Backend multi-stage build
│   ├── nginx.conf              # Nginx configuration for PWA
│   └── .dockerignore           # Build optimization
├── docker-compose.yml          # Production orchestration
├── docker-compose.dev.yml      # Development overrides
└── .dockerignore               # Root build optimization
```

---

## 🔧 Commands Reference

### Build Commands
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend

# Force rebuild without cache
docker-compose build --no-cache
```

### Run Commands
```bash
# Start in detached mode (background)
docker-compose up -d

# Start with logs attached
docker-compose up

# Start specific service
docker-compose up frontend

# Scale services (if needed)
docker-compose up --scale backend=3
```

### Management Commands
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute commands in container
docker-compose exec backend sh
docker-compose exec frontend sh

# Restart services
docker-compose restart
docker-compose restart backend

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v
```

### Cleanup Commands
```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything (CAREFUL!)
docker system prune -a
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in project root:

```env
# Backend Configuration
NODE_ENV=production
PORT=3000
CORS_ORIGIN=http://localhost

# Frontend Configuration (if needed)
VITE_API_URL=http://localhost:3000
```

### Port Mapping

Modify `docker-compose.yml` to change ports:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 8080 to your desired port
  
  backend:
    ports:
      - "4000:3000"  # Change 4000 to your desired port
```

---

## 🔍 Health Checks

Both services include health checks:

```bash
# Check health status
docker-compose ps

# View detailed health info
docker inspect kanban-backend --format='{{.State.Health.Status}}'
docker inspect kanban-frontend --format='{{.State.Health.Status}}'
```

**Health Endpoints:**
- Backend: http://localhost:3000/api/health
- Frontend: http://localhost/

---

## 🐛 Troubleshooting

### Issue: Containers won't start
```bash
# Check logs for errors
docker-compose logs

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Issue: Port already in use
```bash
# Find process using port
netstat -ano | findstr :80
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

### Issue: Build fails
```bash
# Clear build cache
docker-compose build --no-cache

# Remove all containers and rebuild
docker-compose down -v
docker-compose up --build
```

### Issue: Frontend can't reach backend
```bash
# Check network
docker network ls
docker network inspect kanban-network

# Ensure services are on same network
docker-compose ps
```

### Issue: Changes not reflected
```bash
# Development mode: Check volume mounts
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Production mode: Rebuild image
docker-compose build frontend
docker-compose up -d frontend
```

---

## 📊 Performance Optimization

### Image Size
```bash
# View image sizes
docker images | grep kanban

# Multi-stage builds already optimize size:
# - Frontend: ~25MB (nginx:alpine + static files)
# - Backend: ~150MB (node:alpine + production deps)
```

### Build Speed
```bash
# Use BuildKit for faster builds
DOCKER_BUILDKIT=1 docker-compose build

# Layer caching is optimized:
# 1. Dependencies (changes rarely)
# 2. Source code (changes often)
```

---

## 🔒 Security Best Practices

✅ **Implemented:**
- Multi-stage builds (smaller attack surface)
- Non-root user in backend
- Security headers in Nginx
- Health checks
- Read-only volume mounts in dev mode

🔧 **Production Recommendations:**
- Use secrets management (not .env files)
- Enable TLS/HTTPS
- Use Docker Secrets
- Scan images for vulnerabilities:
  ```bash
  docker scan kanban-frontend
  docker scan kanban-backend
  ```

---

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

## 🎯 Next Steps

After Docker setup:
1. [ ] Test build locally: `docker-compose up --build`
2. [ ] Verify health checks: `docker-compose ps`
3. [ ] Test frontend: http://localhost
4. [ ] Test backend: http://localhost:3000/api/health
5. [ ] Commit Docker files to git
6. [ ] Set up CI/CD pipeline
7. [ ] Deploy to cloud (Google Cloud Run, AWS ECS, etc.)

---

**Need help?** Check the main [README.md](../README.md) or open an issue!
