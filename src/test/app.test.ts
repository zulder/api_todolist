import request from 'supertest';
import app from '../app';

describe('GET / ', () => {
  let response;
  it('should return status 404', async () => {
    response = await request(app).get('/');
    expect(response.status).toBe(404);
  });
  it('should return message - Route not found', async () => {
    response = await request(app).get('/');
    expect(response.body).toHaveProperty('message', 'Route not found');
  });
});
