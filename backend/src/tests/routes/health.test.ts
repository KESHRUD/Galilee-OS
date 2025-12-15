import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@app/index';

describe('Health API', () => {
  it('GET /api/health should return 200 and status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});
