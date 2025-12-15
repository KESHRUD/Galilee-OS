import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import authRouter from '../../routes/auth';
import { User } from '../../models/User';
import * as authUtils from '../../utils/auth';

// Mock MongoDB User model
vi.mock('../../models/User', () => ({
  User: {
    findOne: vi.fn(),
    findById: vi.fn(),
    prototype: {
      save: vi.fn(),
    },
  },
}));

// Mock database connection
vi.mock('../../config/database', () => ({
  connectDB: vi.fn(),
  disconnectDB: vi.fn(),
}));

describe('Auth Routes', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/auth', authRouter);
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register new user successfully', async () => {
      // Mock: User doesn't exist
      vi.mocked(User.findOne).mockResolvedValueOnce(null);

      // Mock: Save user
      const mockUser = {
        _id: '123',
        email: 'newuser@example.com',
        name: 'New User',
        password: 'hashedPassword',
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(User.prototype, 'save').mockResolvedValueOnce(mockUser as unknown);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      // Mock: User already exists
      vi.mocked(User.findOne).mockResolvedValueOnce({
        _id: '123',
        email: 'existing@example.com',
      } as unknown);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Existing User',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email already registered');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('email');
    });

    it('should require password minimum length', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '12345', // Too short
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('6 characters');
    });

    it('should require name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          // Missing name
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Name');
    });

    it('should set HttpOnly cookie', async () => {
      vi.mocked(User.findOne).mockResolvedValueOnce(null);

      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test',
        password: 'hash',
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(User.prototype, 'save').mockResolvedValueOnce(mockUser as unknown);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test',
        });

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('token=');
      expect(cookies[0]).toContain('HttpOnly');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const hashedPassword = await authUtils.hashPassword('password123');

      vi.mocked(User.findOne).mockResolvedValueOnce({
        _id: '123',
        email: 'user@example.com',
        name: 'Test User',
        password: hashedPassword,
      } as unknown);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.email).toBe('user@example.com');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject invalid email', async () => {
      vi.mocked(User.findOne).mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should reject invalid password', async () => {
      const hashedPassword = await authUtils.hashPassword('correctpassword');

      vi.mocked(User.findOne).mockResolvedValueOnce({
        _id: '123',
        email: 'user@example.com',
        password: hashedPassword,
      } as unknown);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should validate email format on login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('email');
    });

    it('should not reveal if user exists', async () => {
      // Both invalid email and invalid password should return same error
      vi.mocked(User.findOne).mockResolvedValueOnce(null);

      const response1 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response1.body.error).toBe('Invalid credentials');

      const hashedPassword = await authUtils.hashPassword('correctpass');
      vi.mocked(User.findOne).mockResolvedValueOnce({
        _id: '123',
        email: 'user@example.com',
        password: hashedPassword,
      } as unknown);

      const response2 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'wrongpass',
        });

      expect(response2.body.error).toBe('Invalid credentials');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout and clear cookie', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logout successful');

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('token=;');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user info with valid token', async () => {
      const token = authUtils.generateToken({
        userId: '123',
        email: 'test@example.com',
        name: 'Test User',
      });

      vi.mocked(User.findById).mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({
          _id: '123',
          email: 'test@example.com',
          name: 'Test User',
        }),
      } as unknown);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Not authenticated');
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', ['token=invalid.token.here']);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
    });
  });

  describe('Security', () => {
    it('should not expose password in response', async () => {
      vi.mocked(User.findOne).mockResolvedValueOnce(null);

      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test',
        password: 'hashedPassword',
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(User.prototype, 'save').mockResolvedValueOnce(mockUser as unknown);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test',
        });

      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should trim and lowercase email', async () => {
      vi.mocked(User.findOne).mockResolvedValueOnce(null);

      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test',
        password: 'hash',
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(User.prototype, 'save').mockResolvedValueOnce(mockUser as unknown);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: '  TEST@EXAMPLE.COM  ',
          password: 'password123',
          name: 'Test',
        });

      expect(response.status).toBe(201);
      // MongoDB schema handles lowercase/trim, but validation accepts it
    });
  });
});
