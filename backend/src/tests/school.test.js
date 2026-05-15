const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';

const adminToken = jwt.sign({ id: 1, email: 'admin@test.com', role: 'ADMIN' }, 'test-secret');

const mockSchools = [
  { id: 1, name: 'Escola Teste', city: 'Cornélio Procópio', state: 'PR', address: 'Rua A', phone: null, responsible: null, active: true, createdAt: new Date(), updatedAt: new Date(), _count: { forms: 2 } },
];

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn().mockResolvedValue({ id: 1, name: 'Admin', email: 'admin@test.com', role: 'ADMIN', active: true }),
    },
    school: {
      findMany: jest.fn().mockResolvedValue(mockSchools),
      findUnique: jest.fn().mockResolvedValue(mockSchools[0]),
      count: jest.fn().mockResolvedValue(1),
      create: jest.fn().mockResolvedValue(mockSchools[0]),
      update: jest.fn().mockResolvedValue(mockSchools[0]),
    },
    log: { create: jest.fn().mockResolvedValue({}) },
    $disconnect: jest.fn(),
  })),
}));

describe('School Routes', () => {
  it('GET /api/schools - should return schools list', async () => {
    const res = await request(app)
      .get('/api/schools')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  it('GET /api/schools - should return 401 without token', async () => {
    const res = await request(app).get('/api/schools');
    expect(res.status).toBe(401);
  });

  it('POST /api/schools - should return 400 with missing fields', async () => {
    const res = await request(app)
      .post('/api/schools')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Escola' });
    expect(res.status).toBe(400);
  });
});
