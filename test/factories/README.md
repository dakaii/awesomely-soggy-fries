# MikroORM Factory Usage Guide

This project now uses MikroORM's built-in factory system (`@mikro-orm/seeder`) instead of custom factories.

## Installation

```bash
npm install --save-dev @mikro-orm/seeder
```

## Basic Usage

### Creating Single Entities

```typescript
// Create and persist to database
const user = await new UserFactory(em).createOne({
  username: 'testuser',
  email: 'test@example.com',
});

// Create without persisting (just the data)
const userData = new UserFactory(em).makeOne({
  username: 'testuser',
});
```

### Creating Multiple Entities

```typescript
// Create and persist 5 users
const users = await new UserFactory(em).create(5, {
  password: 'samepassword',
});

// Create 3 users without persisting
const usersData = new UserFactory(em).make(3);
```

## Working with Relationships

### Posts with Users

```typescript
// Create a user first
const user = await new UserFactory(em).createOne();

// Create posts with relationships using .each()
const posts = await new PostFactory(em)
  .each((post) => {
    post.user = user;
  })
  .create(3);

// Or create a single post with a user
const post = await new PostFactory(em).createOne();
post.user = user;
await em.persistAndFlush(post);
```

### Comments with Users and Posts

```typescript
const user = await new UserFactory(em).createOne();
const post = await new PostFactory(em).createOne();
post.user = user;
await em.persistAndFlush(post);

const comments = await new CommentFactory(em)
  .each((comment) => {
    comment.user = user;
    comment.post = post;
  })
  .create(2);
```

## Migration from Old Factories

### Old Way (Custom Factories)

```typescript
// Old usage
const user = await context.data.userFactory.create({ password });
const users = await context.data.userFactory.createMany(5, { password });

const post = await context.data.postFactory.create({ user });
const posts = await context.data.postFactory.createMany(3, { user });
```

### New Way (MikroORM Factories)

```typescript
// New usage - very similar!
const user = await context.data.userFactory.createOne({ password });
const users = await context.data.userFactory.create(5, { password });

// For relationships, use .each() or set after creation
const post = await context.data.postFactory.createOne();
post.user = user;
await em.persistAndFlush(post);

// Or use .each() for multiple
const posts = await context.data.postFactory
  .each((p) => (p.user = user))
  .create(3);
```

## Key Differences

1. **Method Names**:

   - `create()` → `createOne()` (single entity)
   - `createMany(count, data)` → `create(count, data)` (multiple entities)
   - Added: `makeOne()` and `make(count)` for creating without persistence

2. **Relationships**:

   - Old: Pass relationships in data object
   - New: Use `.each()` method or set after creation

3. **Sequences**:
   - Built-in auto-incrementing sequences
   - No need for manual timestamp/random string generation

## Benefits of MikroORM Factories

✅ **Standardized API** - Follows established patterns from Rails/Laravel
✅ **Better TypeScript Support** - Full type safety
✅ **Built-in Sequences** - Auto-incrementing counters
✅ **Relationship Handling** - Proper association management
✅ **Make vs Create** - Clear distinction between data creation and persistence
✅ **Extension Methods** - Chain operations like `.each()`
✅ **Integration with Seeders** - Works seamlessly with MikroORM's seeding system

## Advanced Features

### Using .each() for Complex Setup

```typescript
const posts = await new PostFactory(em)
  .each((post, index) => {
    post.title = `Post ${index + 1}`;
    post.user = users[index % users.length];
  })
  .create(10);
```

### Overriding Factory Defaults

```typescript
// Override specific fields
const adminUser = await new UserFactory(em).createOne({
  username: 'admin',
  email: 'admin@example.com',
});
```
