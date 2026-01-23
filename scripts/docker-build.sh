#!/bin/bash
# ============================================================================
# Docker Build Script
# Build backend and frontend images with version tags
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-mouenis}"  # Replace with your Docker Hub username
VERSION="${1:-latest}"
BACKEND_IMAGE="${DOCKER_USERNAME}/galilee-os-backend"
FRONTEND_IMAGE="${DOCKER_USERNAME}/galilee-os-frontend"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Docker Build Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Building version: ${YELLOW}${VERSION}${NC}"
echo -e "Backend image: ${YELLOW}${BACKEND_IMAGE}:${VERSION}${NC}"
echo -e "Frontend image: ${YELLOW}${FRONTEND_IMAGE}:${VERSION}${NC}"
echo ""

# Build backend
echo -e "${GREEN}[1/2] Building backend image...${NC}"
docker build \
  -f docker/Dockerfile.backend \
  -t "${BACKEND_IMAGE}:${VERSION}" \
  -t "${BACKEND_IMAGE}:latest" \
  .

echo -e "${GREEN}✓ Backend image built successfully${NC}"
echo ""

# Build frontend
echo -e "${GREEN}[2/2] Building frontend image...${NC}"
docker build \
  -f docker/Dockerfile.frontend \
  -t "${FRONTEND_IMAGE}:${VERSION}" \
  -t "${FRONTEND_IMAGE}:latest" \
  .

echo -e "${GREEN}✓ Frontend image built successfully${NC}"
echo ""

# Show image sizes
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Image Sizes:${NC}"
echo -e "${GREEN}========================================${NC}"
docker images | grep galilee-os | head -4

echo ""
echo -e "${GREEN}✓ Build completed successfully!${NC}"
echo ""
echo -e "To push to Docker Hub, run:"
echo -e "  ${YELLOW}./scripts/docker-push.sh ${VERSION}${NC}"
