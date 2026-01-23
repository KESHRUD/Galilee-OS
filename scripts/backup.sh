#!/bin/bash
# ============================================================================
# Database Backup Script
# Create PostgreSQL backup with timestamp
# ============================================================================

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y-%m-%d-%Hh%M")
BACKUP_FILE="${BACKUP_DIR}/galilee-os-${TIMESTAMP}.sql"
COMPOSE_FILE="docker-compose.prod.yml"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}PostgreSQL Backup Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Check if PostgreSQL container is running
if ! docker-compose -f ${COMPOSE_FILE} ps | grep -q postgres; then
  echo -e "${RED}✗ PostgreSQL container is not running${NC}"
  echo -e "Please start services first: ${YELLOW}docker-compose -f ${COMPOSE_FILE} up -d${NC}"
  exit 1
fi

# Create backup
echo -e "${YELLOW}Creating backup...${NC}"
echo -e "File: ${BACKUP_FILE}"
echo ""

docker-compose -f ${COMPOSE_FILE} exec -T postgres pg_dump \
  -U galilee_admin \
  -d galilee_os \
  --clean \
  --if-exists \
  > ${BACKUP_FILE}

# Check if backup was successful
if [ -f "${BACKUP_FILE}" ]; then
  BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
  echo -e "${GREEN}✓ Backup created successfully${NC}"
  echo -e "  Size: ${BACKUP_SIZE}"
  echo -e "  Location: ${BACKUP_FILE}"
  echo ""
  
  # Keep only last 10 backups
  echo -e "${YELLOW}Cleaning old backups (keeping last 10)...${NC}"
  ls -t ${BACKUP_DIR}/galilee-os-*.sql | tail -n +11 | xargs -r rm
  echo -e "${GREEN}✓ Cleanup completed${NC}"
  echo ""
  
  # Show all backups
  echo -e "${GREEN}Available backups:${NC}"
  ls -lh ${BACKUP_DIR}/*.sql 2>/dev/null || echo "  No backups found"
else
  echo -e "${RED}✗ Backup failed${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}To restore from this backup:${NC}"
echo -e "  ${YELLOW}cat ${BACKUP_FILE} | docker-compose -f ${COMPOSE_FILE} exec -T postgres psql -U galilee_admin -d galilee_os${NC}"
