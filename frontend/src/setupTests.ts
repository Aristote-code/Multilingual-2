import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

// Mock API handlers
const handlers = [
  http.post('http://localhost:3001/api/auth/login', () => {
    return HttpResponse.json({ token: 'mock-token' });
  }),
  http.post('http://localhost:3001/api/auth/register', () => {
    return HttpResponse.json({ message: 'User registered successfully' });
  }),
  http.get('http://localhost:3001/api/files', () => {
    return HttpResponse.json([
      {
        _id: '1',
        name: 'test.txt',
        size: 1024,
        createdAt: new Date().toISOString()
      }
    ]);
  })
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());