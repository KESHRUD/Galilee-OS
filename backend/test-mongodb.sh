#!/bin/bash

echo "🧪 Testing MongoDB Integration..."
echo ""

# Health check
echo "1️⃣ Testing health endpoint..."
curl -s http://localhost:3000/api/health | jq
echo ""

# Get all tasks (should be empty initially)
echo "2️⃣ Getting all tasks..."
curl -s http://localhost:3000/api/tasks | jq
echo ""

# Create a new task
echo "3️⃣ Creating a new task..."
curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test MongoDB Task","description":"Testing MongoDB integration","status":"todo","priority":"high"}' | jq
echo ""

# Get all tasks again
echo "4️⃣ Getting all tasks after creation..."
curl -s http://localhost:3000/api/tasks | jq
echo ""

echo "✅ MongoDB integration test complete!"
