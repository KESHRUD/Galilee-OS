# 🚀 Galilee OS - Deployment Guide

Complete guide for deploying Galilee OS to production using Docker Hub.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Production Deployment](#production-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Software

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Git** (optional, for cloning)

### Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER
```

**macOS:**
```bash
brew install docker docker-compose
```

**Windows:**
Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## ⚡ Quick Start

### 1. Download Configuration

```bash
# Option A: Clone repository
git clone https://github.com/KESHRUD/Galilee-OS.git
cd Galilee-OS

# Option B: Download config only
wget https://raw.githubusercontent.com/KESHRUD/Galilee-OS/main/docker-compose.prod.yml
wget https://raw.githubusercontent.com/KESHRUD/Galilee-OS/main/.env.production.example
```

### 2. Configure Environment

```bash
# Copy template
cp .env.production.example .env

# Edit with your values
nano .env
```

**Minimum required changes:**
```bash
DB_PASSWORD=your_secure_password_here
JWT_SECRET=your_secure_jwt_secret_here
```

### 3. Deploy

```bash
# Pull images and start
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run

# (Optional) Seed test data
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

### 4. Access

- **Frontend:** http://localhost
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health

---

## 🏭 Production Deployment

### Step 1: Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Logout and login again
```

### Step 2: Clone & Configure

```bash
# Clone repository
git clone https://github.com/KESHRUD/Galilee-OS.git
cd Galilee-OS

# Create production environment file
cp .env.production.example .env

# Edit configuration
nano .env
```

### Step 3: Deploy with Script

```bash
# Use automated deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh production
```

### Step 4: Verify Deployment

```bash
# Check service health
chmod +x scripts/health-check.sh
./scripts/health-check.sh

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## ⚙️ Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DOCKER_USERNAME` | Your Docker Hub username | `mouenis` |
| `VERSION` | Image version to deploy | `latest` or `1.0.0` |
| `DB_PASSWORD` | PostgreSQL password | `MySecure!Pass123` |
| `JWT_SECRET` | JWT secret key | (generate with `openssl rand -base64 32`) |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Backend port |
| `CORS_ORIGIN` | `http://localhost` | Frontend URL |
| `JWT_EXPIRES_IN` | `7d` | JWT expiration time |

### Generating Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate DB password
openssl rand -base64 24
```

---

## 🗄️ Database Setup

### Running Migrations

```bash
# Apply all pending migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run

# Revert last migration
docker-compose -f docker-compose.prod.yml exec backend npm run migration:revert
```

### Seeding Data

```bash
# Seed with test users and data
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

### Database Backup

```bash
# Create backup
chmod +x scripts/backup.sh
./scripts/backup.sh

# Backups are saved in: ./backups/galilee-os-YYYY-MM-DD-HHhMM.sql
```

### Restore from Backup

```bash
# Restore specific backup
cat backups/galilee-os-2026-01-23-15h30.sql | \
  docker-compose -f docker-compose.prod.yml exec -T postgres \
  psql -U galilee_admin -d galilee_os
```

---

## 🔧 Maintenance

### Updating to New Version

```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Restart services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run
```

### Viewing Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Restarting Services

```bash
# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Cleaning Up

```bash
# Stop and remove containers
docker-compose -f docker-compose.prod.yml down

# Remove volumes (⚠️ deletes database!)
docker-compose -f docker-compose.prod.yml down -v

# Remove unused images
docker system prune -a
```

---

## 🚨 Troubleshooting

### Services Won't Start

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check logs for errors
docker-compose -f docker-compose.prod.yml logs

# Check health
./scripts/health-check.sh
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose -f docker-compose.prod.yml ps postgres

# Test connection
docker-compose -f docker-compose.prod.yml exec postgres \
  psql -U galilee_admin -d galilee_os -c "SELECT 1;"

# Check environment variables
docker-compose -f docker-compose.prod.yml exec backend env | grep DB_
```

### Frontend Can't Reach Backend

1. Check CORS configuration in `.env`:
   ```bash
   CORS_ORIGIN=http://your-domain.com
   ```

2. Verify backend is healthy:
   ```bash
   curl http://localhost:3000/api/health
   ```

3. Check nginx proxy configuration in `docker/nginx.conf`

### Port Already in Use

```bash
# Change ports in .env
PORT=3001  # Backend
# Or edit docker-compose.prod.yml for frontend (80 -> 8080)
```

### Out of Disk Space

```bash
# Remove unused Docker data
docker system prune -a --volumes

# Check disk usage
docker system df
```

---

## 📚 Additional Resources

- [Docker Documentation](docs/DOCKER.md)
- [API Documentation](docs/API.md)
- [GitHub Repository](https://github.com/KESHRUD/Galilee-OS)
- [Docker Hub Images](https://hub.docker.com/u/mouenis)

---

## 💡 Tips

- **Always backup before updating**
- **Monitor logs regularly**
- **Keep `.env` file secure (never commit)**
- **Use strong passwords for production**
- **Enable HTTPS in production (use nginx + Let's Encrypt)**
