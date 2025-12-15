import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@app/index';

describe('Tasks API', () => {
  it('GET /api/tasks without auth should return 401', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  it('POST /api/tasks without auth should return 401', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', description: 'Test desc' });
    expect(res.status).toBe(401);
  });

  it('PUT /api/tasks/:id without auth should return 401', async () => {
    const res = await request(app)
      .put('/api/tasks/some-id')
      .send({ title: 'Updated' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/tasks/:id without auth should return 401', async () => {
    const res = await request(app).delete('/api/tasks/some-id');
    expect(res.status).toBe(401);
  });
});
