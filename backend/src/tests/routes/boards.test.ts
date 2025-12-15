import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@app/index';

describe('Boards API', () => {
  it('GET /api/boards should return 200', async () => {
    const res = await request(app).get('/api/boards');
    expect(res.status).toBe(200);
  });

  it('POST /api/boards should create a board', async () => {
    const res = await request(app)
      .post('/api/boards')
      .send({ name: 'Test Board' });
    expect(res.status).toBe(201);
  });
});
