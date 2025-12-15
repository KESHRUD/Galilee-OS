# MSW (Mock Service Worker) Integration

## 🎯 Purpose

MSW allows you to develop the frontend **without a running backend** by intercepting API calls and returning mock data.

---

## 🚀 Usage

### Enable MSW in Development

Add `?msw=on` to the URL:

```
http://localhost:5173/?msw=on
```

**What happens:**
- All `/api/*` calls are intercepted
- Mock data is returned instead of real backend
- Console shows: `🔶 MSW enabled - API calls are mocked`

---

### Disable MSW (Use Real Backend)

Remove the query parameter:

```
http://localhost:5173/
```

**What happens:**
- API calls go to real backend at `http://localhost:3000`
- Normal development mode

---

## 📁 Files Structure

```
frontend/src/mocks/
├── handlers.ts    # Mock API route definitions
├── browser.ts     # Browser setup (development)
└── server.ts      # Node setup (testing)
```

---

## 🧪 Mock API Routes

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Boards

- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create board

### Health

- `GET /api/health` - Health check (returns `{ mock: true }`)

---

## 🎭 Simulating Errors

MSW can simulate error scenarios:

### 500 Internal Server Error
```
http://localhost:5173/?msw=on&error=500
```

### Timeout (5s delay)
```
http://localhost:5173/?msw=on&error=timeout
```

---

## 📊 Mock Data

Default tasks:
1. ✅ Setup project structure (Done)
2. ✅ Implement drag and drop (Done)
3. 🔄 Add offline support (In Progress)
4. 📝 Write E2E tests (To Do)

---

## 🧪 Using MSW in Tests

### Vitest Example

```typescript
import { setupMockServer } from './mocks/server';

describe('Tasks', () => {
  setupMockServer();
  
  it('fetches tasks', async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    expect(data.data).toHaveLength(4);
  });
});
```

---

## 🔧 Customizing Mock Data

Edit `frontend/src/mocks/handlers.ts`:

```typescript
// Add more tasks
let tasks = [
  {
    id: '5',
    title: 'Your custom task',
    status: 'todo',
    // ...
  },
];
```

---

## 📚 Resources

- [MSW Documentation](https://mswjs.io/)
- [MSW Examples](https://mswjs.io/docs/basics/request-matching)

---

## ✅ Benefits

✅ **No backend needed** - Develop frontend independently  
✅ **Fast iterations** - No server restarts  
✅ **Realistic testing** - Simulates real API responses  
✅ **Error scenarios** - Test edge cases easily  
✅ **Offline development** - Works without internet  

---

**Toggle MSW anytime with `?msw=on` or `?msw=off`** 🚀
