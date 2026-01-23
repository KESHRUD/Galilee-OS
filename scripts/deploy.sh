#!/bin/bash
# ============================================================================
# Automated Deployment Script
# Deploy Galilee OS with one command
# ============================================================================

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
ENV=${1:-production}
COMPOSE_FILE="docker-compose.prod.yml"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Galilee OS Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Environment: ${YELLOW}${ENV}${NC}"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
  echo -e "${RED}✗ .env file not found${NC}"
  echo -e "Please create .env from .env.production.example"
  exit 1
fi

# Pull latest images
echo -e "${YELLOW}[1/5] Pulling latest Docker images...${NC}"
docker-compose -f ${COMPOSE_FILE} pull
echo -e "${GREEN}✓ Images pulled${NC}"
echo ""

# Stop existing containers
echo -e "${YELLOW}[2/5] Stopping existing containers...${NC}"
docker-compose -f ${COMPOSE_FILE} down
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

# Start services
echo -e "${YELLOW}[3/5] Starting services...${NC}"
docker-compose -f ${COMPOSE_FILE} up -d
echo -e "${GREEN}✓ Services started${NC}"
echo ""

# Wait for services to be ready
echo -e "${YELLOW}[4/5] Waiting for services to be healthy...${NC}"
sleep 15

# Run database migrations
echo -e "${YELLOW}[5/5] Running database migrations...${NC}"
docker-compose -f ${COMPOSE_FILE} exec -T backend npm run migration:run
echo -e "${GREEN}✓ Migrations completed${NC}"
echo ""

# Optional: Run seed for development
if [ "$ENV" = "development" ]; then
  echo -e "${YELLOW}Seeding database with test data...${NC}"
  docker-compose -f ${COMPOSE_FILE} exec -T backend npm run seed
  echo -e "${GREEN}✓ Database seeded${NC}"
  echo ""
fi

# Show service status
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Status:${NC}"
echo -e "${GREEN}========================================${NC}"
docker-compose -f ${COMPOSE_FILE} ps
echo ""

# Show logs
echo -e "${YELLOW}To view logs:${NC}"
echo -e "  docker-compose -f ${COMPOSE_FILE} logs -f"
echo ""
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo ""
echo -e "Access your application:"
echo -e "  Frontend: ${YELLOW}http://localhost${NC}"
echo -e "  Backend:  ${YELLOW}http://localhost:3000${NC}"
