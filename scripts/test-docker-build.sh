#!/bin/bash
# ============================================================================
# Docker Build Test Script
# Test Docker builds locally before pushing
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Docker Build Test${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Clean previous builds
echo -e "${YELLOW}[1/5] Cleaning previous builds...${NC}"
docker-compose down -v 2>/dev/null || true
docker system prune -f
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

# Step 2: Build images
echo -e "${YELLOW}[2/5] Building images with docker-compose...${NC}"
docker-compose build --no-cache
echo -e "${GREEN}✓ Images built${NC}"
echo ""

# Step 3: Start services
echo -e "${YELLOW}[3/5] Starting services...${NC}"
docker-compose up -d
echo ""

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Step 4: Health checks
echo -e "${YELLOW}[4/5] Running health checks...${NC}"
echo ""

# Check backend
echo -e "Testing backend API..."
if curl -f http://localhost:3000/api/health &>/dev/null; then
  echo -e "${GREEN}✓ Backend is healthy${NC}"
else
  echo -e "${RED}✗ Backend health check failed${NC}"
  docker-compose logs backend
  exit 1
fi

# Check frontend
echo -e "Testing frontend..."
if curl -f http://localhost/ &>/dev/null; then
  echo -e "${GREEN}✓ Frontend is healthy${NC}"
else
  echo -e "${RED}✗ Frontend health check failed${NC}"
  docker-compose logs frontend
  exit 1
fi

# Check database
echo -e "Testing database..."
if docker-compose exec -T postgres pg_isready -U galilee_admin &>/dev/null; then
  echo -e "${GREEN}✓ Database is healthy${NC}"
else
  echo -e "${RED}✗ Database health check failed${NC}"
  exit 1
fi

echo ""

# Step 5: Show image sizes
echo -e "${YELLOW}[5/5] Image sizes:${NC}"
docker images | grep -E "kanban|REPOSITORY" | head -4
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ All tests passed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Services are running:"
echo -e "  Frontend: ${YELLOW}http://localhost${NC}"
echo -e "  Backend:  ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "To stop services: ${YELLOW}docker-compose down${NC}"
