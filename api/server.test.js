const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
});

afterAll(async () => {
  await db.destroy();
});

test('[1] sanity', () => {
  expect(true).toBe(true);
});

describe('[2] API Endpoints', () => {
  describe('[3] [POST] /api/auth/register', () => {
    // it('[4] should register a new user', async () => {
    //   const newUser = { username: 'testuser', password: 'testpassword' };
    //   const res = await request(server)
    //     .post('/api/auth/register')
    //     .send(newUser);

    //   expect(res.status).toBe(201);
    //   expect(res.body).toHaveProperty('id');
    //   expect(res.body).toHaveProperty('username', 'testuser');
    //   expect(res.body).toHaveProperty('password');
    // });

    it('[5] should return 400 on missing username or password', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'username and password required');
    });

    it('[6] should return 400 on duplicate username', async () => {
      const existingUser = { username: 'existinguser', password: 'existingpassword' };
      await request(server)
        .post('/api/auth/register')
        .send(existingUser);

      const res = await request(server)
        .post('/api/auth/register')
        .send(existingUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'username taken');
    });
  });

  describe('[7] [POST] /api/auth/login', () => {
    // it('[8] should login an existing user', async () => {
    //   const existingUser = { username: 'existinguser', password: 'existingpassword' };
    //   await request(server)
    //     .post('/api/auth/register')
    //     .send(existingUser);

    //   const res = await request(server)
    //     .post('/api/auth/login')
    //     .send(existingUser);

    //   expect(res.status).toBe(200);
    //   expect(res.body).toHaveProperty('message', 'welcome, existinguser');
    //   expect(res.body).toHaveProperty('token');
    // });

    it('[9] should return 400 on missing username or password', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'username and password required');
    });

    it('[10] should return 401 on incorrect username or password', async () => {
      const incorrectUser = { username: 'nonexistentuser', password: 'wrongpassword' };
      const res = await request(server)
        .post('/api/auth/login')
        .send(incorrectUser);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'invalid credentials');
    });
  });

  // it('[11] should return jokes with a valid token', async () => {
  //   const newUser = { username: 'jokeuser', password: 'jokepassword' };
  //   await request(server)
  //     .post('/api/auth/register')
  //     .send(newUser);

  //   const loginRes = await request(server)
  //     .post('/api/auth/login')
  //     .send(newUser);

  //   const token = loginRes.body.token;

  //   const res = await request(server)
  //     .get('/api/jokes')
  //     .set('Authorization', token);

  //   expect(res.status).toBe(200);
  //   expect(res.body).toHaveLength(3);
  // });

  it('[12] should return 401 on missing or invalid token', async () => {
    const resWithoutToken = await request(server).get('/api/jokes');
    const resWithInvalidToken = await request(server)
      .get('/api/jokes')
      .set('Authorization', 'invalid-token');

    expect(resWithoutToken.status).toBe(401);
    expect(resWithInvalidToken.status).toBe(401);
  });
});
