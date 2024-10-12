// import superTest from 'supertest';
// import httpStatus from 'http-status';
// import expressApp from '../../src/app';
// import connectToDB from '../utils/connectToDB';
// import { getFakeWord } from '../utils/fakeData';

// connectToDB();

// const app = superTest(expressApp);
// const fakeRoute = getFakeWord();

// describe('Test Home & 404 Routes', () => {
//   /* API Route */
//   test('GET: \\', async () => {
//     const response = await app.get('/api');
//     expect(response.status).toEqual(httpStatus.OK);
//   });

//   /* 404 Route */
//   test(`GET: \\${fakeRoute}`, async () => {
//     const response = await app.get(`/api/${fakeRoute}`);
//     expect(response.status).toEqual(httpStatus.NOT_FOUND);
//   });
// });

import supertest from 'supertest';
import app from '../../src/app'; // Import the express app

const request = supertest(app);

// describe('Express App API Tests', () => {
test('GET /api - Success', async () => {
  const response = await request.get('/api');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('API is up & running!');
});

//  test('POST /api/data - Success', async () => {
//     const response = await request.post('/api/data').send({ name: 'John' });
//     expect(response.status).toBe(201);
//     expect(response.body.message).toBe('Hello, John');
//   });

//   test('POST /api/data - Missing Name', async () => {
//     const response = await request.post('/api/data').send({});
//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe('Name is required');
//   });

//   test('GET /unknown - 404 Route Not Found', async () => {
//     const response = await request.get('/unknown');
//     expect(response.status).toBe(404);
//     expect(response.body.error).toBe('Route /unknown not found');
//   });
// });
