import * as request from 'supertest';
import {
  IntegrationTestContext,
  createIntegrationTestingModule,
  cleanupIntegrationTestingModule,
  cleanupDatabase,
} from '../utils/integration-test-module';
import { User } from '../../src/entities/user.entity';
import { Post } from '../../src/entities/post.entity';
import { Comment } from '../../src/entities/comment.entity';

describe('CommentsController (e2e)', () => {
  let context: IntegrationTestContext;
  let accessToken: string;
  let user: User;
  let post: Post;
  const password = 'testpassword123';

  beforeEach(async () => {
    context = await createIntegrationTestingModule();
    user = await context.data.userFactory.create({ password });
    post = await context.data.postFactory.create({ user });
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

  describe('POST /comments', () => {
    it('should create a new comment', async () => {
      const createCommentDto = {
        content: 'This is a test comment',
        userId: user.id,
        postId: post.id,
      };

      const response = await request(context.app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createCommentDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe('This is a test comment');
    });

    it('should return 404 if user not found', async () => {
      await request(context.app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'This is a test comment',
          userId: 999,
          postId: post.id,
        })
        .expect(404);
    });

    it('should return 404 if post not found', async () => {
      await request(context.app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'This is a test comment',
          userId: user.id,
          postId: 999,
        })
        .expect(404);
    });
  });

  describe('GET /posts/:id/comments', () => {
    it('should return all comments for a post', async () => {
      await context.data.commentFactory.createMany(2, {
        user,
        post,
      });

      const response = await request(context.app.getHttpServer())
        .get(`/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should return 404 if post not found', async () => {
      await request(context.app.getHttpServer())
        .get('/posts/999/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('GET /users/:id/comments', () => {
    it('should return all comments by a user', async () => {
      await context.data.commentFactory.createMany(2, {
        user,
        post,
      });

      const response = await request(context.app.getHttpServer())
        .get(`/users/${user.id}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should return empty array if user has no comments', async () => {
      const response = await request(context.app.getHttpServer())
        .get(`/users/${user.id}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('should return 404 if user not found', async () => {
      await request(context.app.getHttpServer())
        .get('/users/999/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('PATCH /comments/:id', () => {
    it('should update a comment', async () => {
      const comment = await context.data.commentFactory.create({
        user,
        post,
      });

      await request(context.app.getHttpServer())
        .patch(`/comments/${comment.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'Updated comment content',
        })
        .expect(200);
    });

    it('should return 404 if comment not found', async () => {
      await request(context.app.getHttpServer())
        .patch('/comments/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'Updated comment content',
        })
        .expect(404);
    });
  });

  describe('DELETE /comments/:id', () => {
    it('should delete a comment', async () => {
      const comment = await context.data.commentFactory.create({
        user,
        post,
      });

      await request(context.app.getHttpServer())
        .delete(`/comments/${comment.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      const response = await request(context.app.getHttpServer())
        .get(`/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('should return 404 if comment not found', async () => {
      await request(context.app.getHttpServer())
        .delete('/comments/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
