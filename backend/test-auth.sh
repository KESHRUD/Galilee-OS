#!/bin/bash

echo "🧪 Testing Complete MongoDB Integration with Authentication..."
echo ""

BASE_URL="http://localhost:3000/api"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1️⃣ Register a new user${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }')

echo "$REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
echo -e "${GREEN}✅ Token: $TOKEN${NC}"
echo ""

echo -e "${BLUE}2️⃣ Login with user${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
echo -e "${GREEN}✅ Updated Token: $TOKEN${NC}"
echo ""

echo -e "${BLUE}3️⃣ Get current user (with token)${NC}"
curl -s -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

echo -e "${BLUE}4️⃣ Create a task (protected route)${NC}"
TASK_RESPONSE=$(curl -s -X POST $BASE_URL/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "MongoDB + Auth Task",
    "description": "This task is linked to a user!",
    "status": "todo",
    "priority": "high"
  }')

echo "$TASK_RESPONSE"
TASK_ID=$(echo $TASK_RESPONSE | grep -o '"_id":"[^"]*' | sed 's/"_id":"//')
echo -e "${GREEN}✅ Task ID: $TASK_ID${NC}"
echo ""

echo -e "${BLUE}5️⃣ Get all user's tasks${NC}"
curl -s -X GET $BASE_URL/tasks \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

echo -e "${BLUE}6️⃣ Try to access tasks without token (should fail)${NC}"
curl -s -X GET $BASE_URL/tasks
echo ""
echo ""

echo -e "${GREEN}✅ MongoDB + Auth integration test complete!${NC}"
