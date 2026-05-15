const request = require('supertest');
const app = require('../app');

jest.mock('@prisma/client', () => {
  const mockUser = {
    id: 1,
    name: 'Admin Test',
    email: 'admin@test.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'ADMIN',
    active: true,
  };
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn().mockResolvedValue(mockUser),
        findMany: jest.fn().mockResolvedValue([mockUser]),
      },
      log: { create: jest.fn().mockResolvedValue({}) },
      $disconnect: jest.fn(),
    })),
  };
});

describe('Auth Routes', () => {
  describe('POST /api/auth/login', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ password: '123456' });
      expect(res.status).toBe(400);
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'test@test.com' });
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'notanemail', password: '123456' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /health', () => {
    it('should return 200 ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
