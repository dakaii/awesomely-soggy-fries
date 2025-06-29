<a name="readme-top"></a>
[![GitHub][github-shield]][github-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Medium][medium-shield]][medium-url]

# Chirp API

A Twitter-like API built with NestJS and MikroORM.

## Features

- User management (create, read, update, delete)
- Post management (create, read, update, delete)
- Comment management (create, read, update, delete)
- JWT Authentication
- Integration tests for all features
- Database migrations with MikroORM
- Support for both Docker and local development

## Quick Start

### Option 1: Local Development (Recommended)

Run the application locally with databases in Docker:

```bash
# Install dependencies
npm install

# Quick setup using the setup script
./scripts/setup-env.sh local

# Start the application
make local-start
```

### Option 2: Full Docker Development

Run everything in Docker:

```bash
# Install dependencies
npm install

# Setup Docker environment
./scripts/setup-env.sh docker

# Start with Docker
make dev
```

## Detailed Setup

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Local Development Setup (App runs locally, DB in Docker)

1. Install dependencies:
```bash
npm install
```

2. Setup local environment:
```bash
./scripts/setup-env.sh local
```

3. Start the application locally:
```bash
make local-start
# or directly: npm run start:local
```

4. Run tests locally:
```bash
make local-test
# or directly: npm run test:local
```

### Docker Development Setup (Everything in Docker)

1. Install dependencies:
```bash
npm install
```

2. Setup Docker environment:
```bash
./scripts/setup-env.sh docker
```

3. Start with Docker:
```bash
make dev
```

### Environment Configuration

The application supports multiple environment configurations:

- `.env.local` - Local development (app locally, DB in Docker)
- `.env.docker` - Docker development (everything in Docker)
- `.env.test` - Test environment configuration

## Available Commands

### Make Commands

#### Docker Commands
- `make dev` - Start development server with Docker
- `make start` - Start application in Docker
- `make stop` - Stop Docker containers
- `make test` - Run tests in Docker
- `make logs` - Show application logs
- `make clean` - Clean up containers and volumes

#### Local Development Commands
- `make local-dev` - Setup local development environment
- `make local-start` - Start application locally
- `make local-stop` - Stop local databases
- `make local-test` - Run tests locally
- `make local-test-watch` - Run tests in watch mode locally

#### Database Commands
- `make db-local` - Start local development database
- `make db-test` - Start test database
- `make db-stop` - Stop all local databases
- `make db-clean` - Clean all local database data

#### Migration Commands
- `make migration-up` - Run pending migrations
- `make migration-down` - Rollback last migration
- `make migration-refresh` - Refresh all migrations
- `make migration-status` - Show migration status
- `make migration-create` - Create a new migration
- `make migration-pending` - Show pending migrations

### NPM Commands

#### Application
- `npm run start:local` - Start app locally
- `npm run start:local:debug` - Start app locally with debug
- `npm test` - Run tests
- `npm run test:local` - Run tests locally
- `npm run test:local:watch` - Run tests in watch mode locally

#### Migrations
- `npm run migration:create` - Create a new migration
- `npm run migration:up` - Run pending migrations
- `npm run migration:down` - Rollback last migration
- `npm run migration:refresh` - Refresh all migrations (rollback all and re-run)
- `npm run migration:fresh` - Drop schema and re-run migrations
- `npm run migration:status` - Show migration status
- `npm run migration:pending` - Show pending migrations

#### Schema Commands
- `npm run schema:create` - Create database schema
- `npm run schema:update` - Update database schema
- `npm run schema:drop` - Drop database schema
- `npm run schema:fresh` - Drop and recreate schema

## Database Configuration

### Local Development
- **Development DB**: `localhost:5432` (chirp_db)
- **Test DB**: `localhost:5433` (chirp_test)

### Docker Development
- **Development DB**: Internal Docker network (chirp_db)
- **Test DB**: Internal Docker network (chirp_test)

## Database Migrations

Migrations are used to manage database schema changes. All migrations are stored in the `./migrations` directory.

### Creating a Migration

To create a new migration:
```bash
make migration-create
# or: npm run migration:create
```

### Running Migrations

To run pending migrations:
```bash
make migration-up
# or: npm run migration:up
```

### Migration Refresh

To rollback all migrations and re-run them:
```bash
make migration-refresh
# or: npm run migration:refresh
```

```bash
npm run migration:create
```

This will prompt you for a migration name. Use descriptive names like "add-user-table" or "add-post-status-column".

The migration will be created in the `./migrations` directory. Review and adjust the generated migration file if needed.

### Running Migrations

To apply all pending migrations:

```bash
npm run migration:up
```

To revert the last migration:

```bash
npm run migration:down
```

### Testing with Migrations

The test environment uses the same migration files as production. This ensures that your test database schema matches your production schema exactly.

When running tests:

1. The test database is created with a clean schema
2. All migrations are run before the tests start
3. Each test suite starts with a fresh database state

## Development

Start the development server:

```bash
npm run start:dev
```

Run tests:

```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e
```

## API Documentation

### Users

- `POST /users` - Create a new user
- `GET /users` - List all users
- `GET /users/:id` - Get a specific user
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

### Posts

- `POST /posts` - Create a new post
- `GET /posts` - List all posts
- `GET /posts/:id` - Get a specific post
- `GET /posts/user/:userId` - Get all posts by a user
- `PATCH /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post

### Comments

- `POST /comments` - Create a new comment
- `GET /comments/post/:postId` - Get all comments on a post
- `GET /comments/user/:userId` - Get all comments by a user
- `GET /comments/:id` - Get a specific comment
- `PATCH /comments/:id` - Update a comment
- `DELETE /comments/:id` - Delete a comment

## Project Structure

```
src/
├── controllers/        # Route controllers
│   ├── app.controller.ts
│   ├── users.controller.ts
│   └── posts.controller.ts
├── services/          # Business logic
│   ├── app.service.ts
│   ├── users.service.ts
│   └── posts.service.ts
├── entities/          # Database entities
│   ├── user.entity.ts
│   ├── post.entity.ts
│   └── comment.entity.ts
├── dto/               # Data transfer objects
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   ├── create-post.dto.ts
│   └── update-post.dto.ts
├── modules/           # Feature modules
│   ├── users.module.ts
│   └── posts.module.ts
└── app.module.ts      # Root module
```

## Features

- User management (CRUD operations)
- Post management (CRUD operations)
- Relationships between users and posts
- Input validation using class-validator
- PostgreSQL database with MikroORM
- Docker support for development and testing

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Docker

```bash
# Start development environment
docker-compose up -d

# Start test environment
docker-compose -f docker-compose.test.yml up -d

# Stop and remove containers
docker-compose down -v
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Challenges and Caveats

This project encountered several significant technical challenges during development. Here's a comprehensive overview of the difficulties faced and how they were resolved:

### 1. MikroORM Jest Integration Issues

**Challenge**: The `Map.prototype.set` error in Jest with MikroORM

- **Symptoms**: Tests failing with `TypeError: Map.prototype.set called on incompatible receiver`
- **Root Cause**: Incompatibility between Jest's `globalSetup`/`globalTeardown` and MikroORM's internal Map usage
- **Solution**: Removed `globalSetup` from Jest configuration and moved database setup to `setupFilesAfterEnv` using standard `beforeAll()` hooks
- **Result**: Sequential tests improved from 0/64 to 64/64 passing

### 2. Parallel Testing Architecture

**Challenge**: Implementing reliable parallel test execution

- **Symptoms**: Foreign key constraint violations and entity relationship conflicts
- **Root Cause**: Each Jest worker gets an isolated database, but factories used hardcoded IDs that don't exist across different worker databases
- **Approach**: Built comprehensive parallel testing infrastructure with:
  - Worker-aware database configuration
  - Isolated factory providers per worker
  - Clean architectural separation in `test/parallel/` directory
- **Current Status**:
  - ✅ Sequential tests: 64/64 passing
  - 🔶 Parallel tests: Partially working but still encountering foreign key issues

### 3. Database Test Isolation

**Challenge**: Ensuring clean database state between tests

- **Initial Approach**: Transaction-based isolation with rollbacks
- **Problems**: Complex nested transaction management and potential deadlocks
- **Final Solution**: Database cleanup using dynamic table discovery
  - Query PostgreSQL metadata to get all user tables automatically
  - Disable foreign key constraints during cleanup
  - Re-enable constraints after cleanup
- **Benefits**: Maintainable, reliable, and automatically adapts to schema changes

### 4. Entity Factory Complexity

**Challenge**: Managing test data creation across different test environments

- **Evolution**:
  1. Started with hardcoded seeding
  2. Moved to complex factory hierarchies
  3. Implemented Factory Provider pattern for clean separation
- **Final Architecture**:
  - Simple factories focused only on entity creation
  - Centralized logic in `factory-provider.ts` for environment-aware behavior
  - Tests use clean `context.factories.createUser()` API without knowing about parallel/sequential modes

### 5. MikroORM Global Context Issues

**Challenge**: `RequestContext` and global context conflicts in tests

- **Solution**: Set `allowGlobalContext: true` for test environments
- **Configuration**: Environment-aware context handling in MikroORM config

### 6. Test Performance and Reliability

**Challenge**: Balancing test speed with reliability

- **Considerations**:
  - Sequential tests: Slower but 100% reliable
  - Parallel tests: Faster but complex database isolation requirements
- **Approach**: Dual configuration supporting both modes:

  ```bash
  # Sequential (reliable)
  npm run test

  # Parallel (experimental)
  npm run test:parallel
  ```

### 7. Database Migration Management

**Challenge**: Ensuring consistent schema across environments

- **Solution**: Comprehensive migration strategy with:
  - Transactional migrations
  - All-or-nothing approach
  - Separate test database initialization
  - Environment-aware entity path resolution

### Key Lessons Learned

1. **Jest + ORM Integration**: Always use `setupFilesAfterEnv` instead of `globalSetup` for database ORMs
2. **Test Isolation**: Database cleanup is more reliable than transaction rollbacks for integration tests
3. **Parallel Testing**: Requires careful architecture and may not always be worth the complexity
4. **Factory Patterns**: Clean separation between data creation and environment logic reduces complexity
5. **Progressive Enhancement**: Build sequential tests first, then add parallel testing as an optional feature

### Architecture Decisions

- **Clean Separation**: All parallel-specific code isolated in `test/parallel/`
- **Backward Compatibility**: Main test suite remains simple and reliable
- **Environment Detection**: Smart configuration based on `NODE_ENV` and `JEST_WORKER_ID`
- **Documentation First**: Comprehensive documentation for complex testing infrastructure

## Contact

Daiki Nakashita - [@LinkedIn](https://www.linkedin.com/in/daikinakashita/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[linkedin-shield]: https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white
[linkedin-url]: https://www.linkedin.com/in/daikinakashita/
[github-shield]: https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white
[github-url]: https://github.com/dakaii/
[medium-shield]: https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white
[medium-url]: https://dakaii.medium.com/
