#!/bin/bash
# ============================================================================
# Docker Push Script
# Push backend and frontend images to Docker Hub
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
echo -e "${GREEN}Docker Push Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Pushing version: ${YELLOW}${VERSION}${NC}"
echo ""

# Check if logged in to Docker Hub
echo -e "${YELLOW}Checking Docker Hub authentication...${NC}"
# Try to check authentication by verifying credentials file exists
if [ ! -f ~/.docker/config.json ] || ! grep -q "docker.io" ~/.docker/config.json 2>/dev/null; then
  echo -e "${YELLOW}⚠ Could not verify Docker Hub authentication${NC}"
  echo -e "${YELLOW}Attempting to push anyway...${NC}"
  echo ""
else
  echo -e "${GREEN}✓ Docker Hub credentials found${NC}"
  echo ""
fi

# Push backend
echo -e "${GREEN}[1/4] Pushing backend:${VERSION}...${NC}"
docker push "${BACKEND_IMAGE}:${VERSION}"
echo -e "${GREEN}✓ Backend:${VERSION} pushed${NC}"
echo ""

echo -e "${GREEN}[2/4] Pushing backend:latest...${NC}"
docker push "${BACKEND_IMAGE}:latest"
echo -e "${GREEN}✓ Backend:latest pushed${NC}"
echo ""

# Push frontend
echo -e "${GREEN}[3/4] Pushing frontend:${VERSION}...${NC}"
docker push "${FRONTEND_IMAGE}:${VERSION}"
echo -e "${GREEN}✓ Frontend:${VERSION} pushed${NC}"
echo ""

echo -e "${GREEN}[4/4] Pushing frontend:latest...${NC}"
docker push "${FRONTEND_IMAGE}:latest"
echo -e "${GREEN}✓ Frontend:latest pushed${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Push completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Your images are now available at:"
echo -e "  ${YELLOW}https://hub.docker.com/r/${DOCKER_USERNAME}/galilee-os-backend${NC}"
echo -e "  ${YELLOW}https://hub.docker.com/r/${DOCKER_USERNAME}/galilee-os-frontend${NC}"
