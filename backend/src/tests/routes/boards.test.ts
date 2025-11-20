import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index';

describe('Boards API', () => {
  it('GET /api/boards should return 200 and array', async () => {
    const res = await request(app).get('/api/boards');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/boards should create a board', async () => {
    const res = await request(app)
      .post('/api/boards')
      .send({ name: 'Test Board' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Test Board');
  });
});