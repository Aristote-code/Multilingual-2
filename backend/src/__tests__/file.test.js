const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../server');
const User = require('../models/User');
const File = require('../models/File');

describe('File Routes', () => {
  let token;
  let user;

  beforeEach(async () => {
    user = await User.create({
      username: 'testuser',
      password: 'password123'
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    token = loginRes.body.token;
  });

  describe('POST /api/files/upload', () => {
    it('should upload a file', async () => {
      const testFilePath = path.join(__dirname, 'test-files', 'test.txt');
      fs.writeFileSync(testFilePath, 'test content');

      const res = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', testFilePath);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('test.txt');
      expect(res.body.owner.toString()).toBe(user._id.toString());

      fs.unlinkSync(testFilePath);
    });

    it('should not upload without authentication', async () => {
      const res = await request(app)
        .post('/api/files/upload')
        .attach('file', Buffer.from('test content'), 'test.txt');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/files', () => {
    it('should list user files', async () => {
      await File.create({
        name: 'test.txt',
        path: 'test.txt',
        size: 1024,
        owner: user._id
      });

      const res = await request(app)
        .get('/api/files')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('test.txt');
    });
  });

  describe('DELETE /api/files/:id', () => {
    it('should delete a file', async () => {
      const file = await File.create({
        name: 'test.txt',
        path: 'test.txt',
        size: 1024,
        owner: user._id
      });

      const res = await request(app)
        .delete(`/api/files/${file._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('File deleted successfully');

      const deletedFile = await File.findById(file._id);
      expect(deletedFile).toBeNull();
    });

    it('should not delete file of another user', async () => {
      const otherUser = await User.create({
        username: 'otheruser',
        password: 'password123'
      });

      const file = await File.create({
        name: 'test.txt',
        path: 'test.txt',
        size: 1024,
        owner: otherUser._id
      });

      const res = await request(app)
        .delete(`/api/files/${file._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });
});