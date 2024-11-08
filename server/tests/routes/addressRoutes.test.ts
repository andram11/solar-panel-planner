import request from 'supertest';
import app from '../../server'

describe('GET /addresses/search', () => {
  it('should return 200 and matching addresses', async () => {
    const response = await request(app).get('/address/search').query({ streetName: 'Main' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should return 400 if no query parameters are provided', async () => {
    const response = await request(app).get('/address/search');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});
