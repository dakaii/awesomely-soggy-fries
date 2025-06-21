import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserFactory } from './user.factory';
import { PostFactory } from './post.factory';
import { CommentFactory } from './comment.factory';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Create 10 users
    const users = await new UserFactory(em).create(10);

    // Create 30 posts, distributed among users
    const posts = await new PostFactory(em).create(30);
    for (let i = 0; i < posts.length; i++) {
      posts[i].user = users[i % users.length];
    }
    await em.persistAndFlush(posts);

    // Create 100 comments, distributed among posts and users
    const comments = await new CommentFactory(em).create(100);
    for (let i = 0; i < comments.length; i++) {
      comments[i].user = users[i % users.length];
      comments[i].post = posts[i % posts.length];
    }
    await em.persistAndFlush(comments);

    console.log('Database seeded successfully!');
    console.log(
      `Created ${users.length} users, ${posts.length} posts, and 100 comments`,
    );
  }
}
