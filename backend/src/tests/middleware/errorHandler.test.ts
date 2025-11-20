import { describe, it, expect, vi } from 'vitest';
import { errorHandler } from '../../middleware/errorHandler';

describe('errorHandler middleware', () => {
  it('should handle errors and send response', () => {
    const err = new Error('Test error');
    const req = {} as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', status: 'error' });
  });
});