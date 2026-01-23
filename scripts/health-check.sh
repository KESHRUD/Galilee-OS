#!/bin/bash
# ============================================================================
# Health Check Script
# Monitor the health of all services
# ============================================================================

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_URL="http://localhost"
BACKEND_URL="http://localhost:3000/api/health"
COMPOSE_FILE="docker-compose.prod.yml"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Galilee OS Health Check${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Counter for failures
FAILURES=0

# ==========================================================================
# Check Frontend
# ==========================================================================
echo -ne "Frontend (${FRONTEND_URL}): "
if curl -f -s -o /dev/null -w "%{http_code}" ${FRONTEND_URL} | grep -q "200"; then
  echo -e "${GREEN}✓ Healthy${NC}"
else
  echo -e "${RED}✗ Unhealthy${NC}"
  FAILURES=$((FAILURES + 1))
fi

# ==========================================================================
# Check Backend API
# ==========================================================================
echo -ne "Backend (${BACKEND_URL}): "
BACKEND_RESPONSE=$(curl -f -s ${BACKEND_URL} 2>/dev/null)
if echo "${BACKEND_RESPONSE}" | grep -q "ok"; then
  echo -e "${GREEN}✓ Healthy${NC}"
else
  echo -e "${RED}✗ Unhealthy${NC}"
  FAILURES=$((FAILURES + 1))
fi

# ==========================================================================
# Check PostgreSQL
# ==========================================================================
echo -ne "PostgreSQL: "
if docker-compose -f ${COMPOSE_FILE} exec -T postgres pg_isready -U galilee_admin &>/dev/null; then
  echo -e "${GREEN}✓ Healthy (accepting connections)${NC}"
else
  echo -e "${RED}✗ Unhealthy${NC}"
  FAILURES=$((FAILURES + 1))
fi

echo ""

# ==========================================================================
# Docker Container Status
# ==========================================================================
echo -e "${YELLOW}Docker Container Status:${NC}"
docker-compose -f ${COMPOSE_FILE} ps

echo ""

# ==========================================================================
# Summary
# ==========================================================================
if [ ${FAILURES} -eq 0 ]; then
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}✓ All services are healthy${NC}"
  echo -e "${GREEN}========================================${NC}"
  exit 0
else
  echo -e "${RED}========================================${NC}"
  echo -e "${RED}✗ ${FAILURES} service(s) unhealthy${NC}"
  echo -e "${RED}========================================${NC}"
  echo ""
  echo -e "${YELLOW}To view logs:${NC}"
  echo -e "  docker-compose -f ${COMPOSE_FILE} logs -f"
  exit 1
fi
