import * as request from 'supertest';
import {
  IntegrationTestContext,
  createIntegrationTestingModule,
  cleanupIntegrationTestingModule,
  cleanupDatabase,
} from '../utils/integration-test-module';
import { User } from '../../src/entities/user.entity';

describe('UsersController (e2e)', () => {
  let context: IntegrationTestContext;
  let accessToken: string;
  let user: User;
  const password = 'testpassword123';

  beforeEach(async () => {
    context = await createIntegrationTestingModule();
    await cleanupDatabase(context); // Clean up before to ensure a clean state
    user = await context.data.userFactory.create({ password });
    const loginResponse = await request(context.app.getHttpServer())
      .post('/auth/login')
      .send({ username: user.username, password });
    accessToken = loginResponse.body.access_token;
  });

  afterEach(async () => {
    await cleanupDatabase(context);
  });

  afterAll(async () => {
    await cleanupIntegrationTestingModule(context);
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const workerId = process.env.JEST_WORKER_ID || '1';
      const testId = 'create_new_user';
      const uniqueSuffix = `${workerId}_${testId}_${Math.random().toString(36).substr(2, 6)}`;
      const createUserDto = {
        username: `completely_unique_user_${uniqueSuffix}`,
        email: `totally_unique_${uniqueSuffix}@different-domain.com`,
        password: 'password123',
      };

      const response = await request(context.app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(
        `completely_unique_user_${uniqueSuffix}`,
      );
      expect(response.body.email).toBe(
        `totally_unique_${uniqueSuffix}@different-domain.com`,
      );
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 409 for duplicate email', async () => {
      const workerId = process.env.JEST_WORKER_ID || '1';
      const testId = 'duplicate_email';
      const uniqueSuffix = `${workerId}_${testId}_${Math.random().toString(36).substr(2, 6)}`;
      const createUserDto = {
        username: `firstuser_${uniqueSuffix}`,
        email: `duplicate_${uniqueSuffix}@unique.test`,
        password: 'password123',
      };

      // Create first user
      await request(context.app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      // Try to create second user with same email
      const duplicateDto = {
        username: `seconduser_${uniqueSuffix}`,
        email: `duplicate_${uniqueSuffix}@unique.test`,
        password: 'password123',
      };

      await request(context.app.getHttpServer())
        .post('/users')
        .send(duplicateDto)
        .expect(409);
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      await context.data.userFactory.createMany(2);
      const response = await request(context.app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      // The user from beforeEach + 2 new users
      expect(response.body).toHaveLength(3);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const response = await request(context.app.getHttpServer())
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(response.body.id).toBe(user.id);
    });

    it('should return 404 for non-existent user', async () => {
      await request(context.app.getHttpServer())
        .get('/users/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };

      const response = await request(context.app.getHttpServer())
        .patch(`/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', user.id);
      expect(response.body).toHaveProperty('username', 'updateduser');
      expect(response.body).toHaveProperty('email', 'updated@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const updateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };

      await request(context.app.getHttpServer())
        .patch('/users/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      await request(context.app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      await request(context.app.getHttpServer())
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      await request(context.app.getHttpServer())
        .delete('/users/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
