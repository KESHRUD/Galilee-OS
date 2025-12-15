import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@app/index';

describe('Boards API', () => {
  it('GET /api/boards without auth should return 401', async () => {
    const res = await request(app).get('/api/boards');
    expect(res.status).toBe(401);
  });

  it('POST /api/boards without auth should return 401', async () => {
    const res = await request(app)
      .post('/api/boards')
      .send({ name: 'Test Board' });
    expect(res.status).toBe(401);
  });
});
