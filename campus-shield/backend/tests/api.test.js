import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Item } from '../src/models/Item.js';
import { Match } from '../src/models/Match.js';

describe('Campus Shield Backend API Tests', () => {
  let authToken = '';
  let studentUser = null;
  let testLostItemId = '';
  let testFoundItemId = '';

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('GET /api/health should return ok status and AI service status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('campus-shield-backend');
    expect(res.body.aiService).toBeDefined();
  });

  it('POST /api/auth/register should register a new student user and return JWT', async () => {
    const uniqueEmail = `test_student_${Date.now()}@university.edu`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Aarav Sharma',
        email: uniqueEmail,
        password: 'Password123!',
        department: 'Computer Science',
        studentId: 'CS-2026-001',
        phone: '+91 98765 43210',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(uniqueEmail);
    expect(res.body.data.user.password).toBeUndefined();

    authToken = res.body.data.token;
    studentUser = res.body.data.user;
  });

  it('POST /api/auth/login should authenticate user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: studentUser.email,
        password: 'Password123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.id).toBe(studentUser.id);
  });

  it('GET /api/auth/me should return authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(studentUser.email);
  });

  it('POST /api/items should create a lost item report', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'lost',
        title: 'Space Grey MacBook Air M2',
        category: 'Electronics & Gadgets',
        location: 'Central Library - 2nd Floor Reading Hall',
        date: '2026-10-28',
        time: '14:30',
        description: 'Navy blue leather sleeve, slight scratch near Apple logo.',
        brand: 'Apple',
        color: 'Space Grey',
        reward: '₹1000',
        securityQuestion: 'What stickers are on the keyboard palm rest?',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.item.title).toContain('MacBook');
    expect(res.body.data.item.status).toBe('active');
    expect(res.body.data.item.id).toBeDefined();

    testLostItemId = res.body.data.item.id;
  });

  it('POST /api/items should create a found item report and compute matches', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'found',
        title: 'Apple MacBook Laptop Found',
        category: 'Electronics & Gadgets',
        location: 'Central Library - 2nd Floor Reading Hall',
        date: '2026-10-28',
        time: '15:00',
        description: 'Found on table 12 in the library quiet section. Dark grey laptop in sleeve.',
        brand: 'Apple',
        color: 'Grey',
        custodyLocation: 'Library Security Desk Desk #1',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.item.type).toBe('found');
    expect(res.body.data.matches).toBeInstanceOf(Array);

    testFoundItemId = res.body.data.item.id;
  });

  it('GET /api/items should return filtered items', async () => {
    const res = await request(app).get('/api/items?type=lost');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((i) => i.id === testLostItemId)).toBe(true);
  });

  it('GET /api/matches should return matches between lost and found items', async () => {
    const res = await request(app).get('/api/matches');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    if (res.body.data.length > 0) {
      const match = res.body.data[0];
      expect(match.lostItem).toBeDefined();
      expect(match.foundItem).toBeDefined();
      expect(match.score).toBeGreaterThanOrEqual(50);
    }
  });

  it('POST /api/messages/thread should create or get a chat thread', async () => {
    const res = await request(app)
      .post('/api/messages/thread')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        participant: {
          id: studentUser.id,
          name: studentUser.name,
          department: studentUser.department,
        },
        item: {
          id: testLostItemId,
          title: 'Space Grey MacBook Air M2',
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.messages.length).toBeGreaterThan(0);
  });

  it('GET /api/stats should return aggregate campus lost & found metrics', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalReported).toBeGreaterThanOrEqual(2);
    expect(res.body.data.activeLost).toBeGreaterThanOrEqual(1);
    expect(res.body.data.activeFound).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/items/:id/resolve should mark item as reunited', async () => {
    const res = await request(app)
      .post(`/api/items/${testLostItemId}/resolve`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        resolutionNote: 'Handed over at campus security counter with verification proof.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('resolved');
  });
});

