# 🐳 Galilee OS - Docker Architecture

Technical documentation of the Docker containerization and multi-stage build optimization.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Docker Images](#docker-images)
- [Multi-Stage Builds](#multi-stage-builds)
- [Network Configuration](#network-configuration)
- [Volume Management](#volume-management)
- [Health Checks](#health-checks)
- [Security Best Practices](#security-best-practices)

---

## 🏗️ Architecture Overview

Galilee OS uses a **3-tier containerized architecture**:

```
┌─────────────────────────────────────────────────┐
│                   Frontend                      │
│          Nginx + React PWA (Alpine)             │
│              Port 80 → :80                     │
└──────────────────┬──────────────────────────────┘
                   │ HTTP/WebSocket
┌──────────────────▼──────────────────────────────┐
│                  Backend                        │
│       Node.js + Express + TypeORM (Alpine)      │
│              Port 3000 → :3000                 │
└──────────────────┬──────────────────────────────┘
                   │ PostgreSQL Protocol
┌──────────────────▼──────────────────────────────┐
│                 Database                        │
│            PostgreSQL 15                        │
│              Port 5433 → :5432                 │
└─────────────────────────────────────────────────┘
```

### Container Communication

All containers communicate via a **custom bridge network** (`kanban-network`):
- Internal DNS resolution (e.g., `http://backend:3000`)
- Isolated from external networks
- Only specified ports exposed to host

---

## 🖼️ Docker Images

### Image Specifications

| Service | Base Image | Size | Optimization |
|---------|-----------|------|--------------|
| **Backend** | `node:20-alpine` | ~285MB | Multi-stage build, production deps only |
| **Frontend** | `nginx:1.27-alpine` | ~45MB | Multi-stage build, static files only |
| **Database** | `postgres:15` | ~380MB | Official image, no customization |

### Image Tags

```bash
# Docker Hub images
mouenis/galilee-os-backend:latest
mouenis/galilee-os-backend:1.0.0

mouenis/galilee-os-frontend:latest
mouenis/galilee-os-frontend:1.0.0
```

---

## 🔨 Multi-Stage Builds

### Backend Dockerfile

**Stage 1: Builder** (Full Node.js environment)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci                        # Install ALL dependencies
COPY backend/ ./
RUN npm run build                 # Compile TypeScript → JavaScript
```

**Stage 2: Production** (Minimal runtime)
```dockerfile
FROM node:20-alpine AS production
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production     # Production deps only (no devDependencies)
COPY --from=builder /app/dist ./dist   # Copy compiled files only
USER nodejs                      # Run as non-root user
CMD ["node", "dist/index.js"]
```

**Benefits:**
- ✅ **64% size reduction** (800MB → 285MB)
- ✅ No source code in final image
- ✅ No dev dependencies (TypeScript, ESLint, etc.)
- ✅ Faster deployment

### Frontend Dockerfile

**Stage 1: Builder** (Node.js build environment)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build                # Build React → static files
```

**Stage 2: Production** (Nginx server)
```dockerfile
FROM nginx:1.27-alpine AS production
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
```

**Benefits:**
- ✅ **96% size reduction** (1.2GB → 45MB)
- ✅ No Node.js in final image
- ✅ Optimized Nginx for serving static files
- ✅ Production-ready caching and compression

---

## 🌐 Network Configuration

### Custom Bridge Network

```yaml
networks:
  kanban-network:
    driver: bridge
    name: kanban-network
```

**Features:**
- **DNS Resolution:** Containers can reach each other by name
- **Isolation:** Separate from default Docker network
- **Custom IP Range:** Avoids conflicts

### Port Mapping

| Service | Internal | External (Host) |
|---------|----------|-----------------|
| Frontend | `:80` | `:80` |
| Backend | `:3000` | `:3000` |
| PostgreSQL | `:5432` | `:5433` |

**Example:** Frontend Nginx proxies `/api/*` to `http://backend:3000/api/*` internally.

---

## 💾 Volume Management

### Named Volumes

```yaml
volumes:
  postgres_data:
    name: postgres_data
```

**Purpose:** Persistent database storage that survives container restarts.

### Volume Location

```bash
# Find volume location
docker volume inspect postgres_data

# Backup volume
docker run --rm \
  -v postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres_data.tar.gz /data
```

### Volume Best Practices

- ✅ **Always backup** before updates
- ✅ **Never delete** volumes in production without backup
- ✅ Use volume for database only (not for application code)

---

## 🏥 Health Checks

### Backend Health Check

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 3s
  retries: 3
  start_period: 10s
```

**Endpoint Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-23T15:30:00.000Z"
}
```

### Frontend Health Check

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
  interval: 30s
  timeout: 3s
  retries: 3
  start_period: 5s
```

### PostgreSQL Health Check

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U galilee_admin -d galilee_os"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### Checking Health Status

```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Manual health check
./scripts/health-check.sh
```

---

## 🔒 Security Best Practices

### 1. Non-Root User

Backend runs as `nodejs` user (UID 1001):
```dockerfile
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs
```

### 2. Minimal Base Images

Using Alpine Linux:
- **Smaller attack surface**
- **Fewer vulnerabilities**
- **Faster security updates**

### 3. No Secrets in Images

All sensitive data via environment variables:
```bash
JWT_SECRET=${JWT_SECRET}      # From .env
DB_PASSWORD=${DB_PASSWORD}    # Never hardcoded
```

### 4. Read-Only Filesystem (Optional)

For extra security, mount filesystem as read-only:
```yaml
read_only: true
tmpfs:
  - /tmp
  - /var/run
```

### 5. Network Isolation

- Only required ports exposed
- Database not directly accessible from internet
- CORS configured for frontend domain only

---

## 📊 Image Size Comparison

### Before Optimization

| Service | Base | Size |
|---------|------|------|
| Backend | `node:20` | ~800MB |
| Frontend | `node:20` + `nginx:latest` | ~1.2GB |
| **Total** | | **~2GB** |

### After Optimization

| Service | Base | Size | Reduction |
|---------|------|------|-----------|
| Backend | `node:20-alpine` (multi-stage) | ~285MB | **-64%** |
| Frontend | `nginx:1.27-alpine` (multi-stage) | ~45MB | **-96%** |
| **Total** | | **~330MB** | **-83%** |

---

## 🚀 Build Performance

### Layer Caching Strategy

Dockerfile order optimized for caching:
```dockerfile
# 1. Copy package files first (changes rarely)
COPY package*.json ./
RUN npm ci

# 2. Copy source code last (changes frequently)
COPY . ./
RUN npm run build
```

**Result:** Dependencies cached → **faster rebuilds**

### Build Times

| Stage | Before | After | Improvement |
|-------|--------|-------|-------------|
| Backend | 5min 20s | 1min 45s | **-67%** |
| Frontend | 8min 10s | 2min 30s | **-69%** |

---

## 🔧 Advanced Configuration

### Custom Nginx Configuration

Located in `docker/nginx.conf`:

- **Gzip compression** for faster transfers
- **Caching headers** for static assets
- **Security headers** (XSS, Content-Type sniffing)
- **Service Worker** support (no-cache for `sw.js`)
- **API proxy** to backend

### Environment Variables

**Build-time:** Defined in Dockerfile
```dockerfile
ENV NODE_ENV=production
```

**Runtime:** Defined in docker-compose.yml or .env
```yaml
environment:
  - DB_HOST=postgres
  - JWT_SECRET=${JWT_SECRET}
```

---

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Deployment Guide](DEPLOYMENT.md)
- [GitHub Actions CI/CD](../.github/workflows/)

---

## 💡 Tips

- Use `docker-compose.yml` for **local development** (builds from source)
- Use `docker-compose.prod.yml` for **production** (pulls from Docker Hub)
- Always run health checks after deployment
- Monitor image sizes with `docker images`
- Use BuildKit for faster builds: `DOCKER_BUILDKIT=1 docker build`
