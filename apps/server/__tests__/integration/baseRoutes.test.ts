import superTest from 'supertest';
import httpStatus from 'http-status';
import expressApp from '../../src/app';
import { getFakeWord } from '../utils';

const app = superTest(expressApp);
const fakeRoute = getFakeWord();

describe('Test Home & 404 Routes', () => {
  /* API Route */
  test('GET: \\', async () => {
    const response = await app.get('/api');
    expect(response.status).toEqual(httpStatus.OK);
  });

  /* 404 Route */
  test(`GET: \\${fakeRoute}`, async () => {
    const response = await app.get(`/api/${fakeRoute}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });
});
