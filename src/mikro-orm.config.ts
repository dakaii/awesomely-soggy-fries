import { Options } from '@mikro-orm/core';
import { SeedManager } from '@mikro-orm/seeder';
import { DEFAULT_PORTS } from './config';

const config: Options = {
  extensions: [SeedManager],
  entities:
    process.env.NODE_ENV === 'production'
      ? ['./dist/entities/*.entity.js']
      : ['./src/entities/*.entity.ts'],
  type: 'postgresql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(
    process.env.DB_PORT ||
      (process.env.NODE_ENV === 'test'
        ? DEFAULT_PORTS.DB_TEST.toString()
        : DEFAULT_PORTS.DB_DEV.toString()),
    10,
  ),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  dbName:
    process.env.DB_NAME ||
    (process.env.NODE_ENV === 'test' ? 'chirp_test' : 'chirp_db'),
  debug: process.env.NODE_ENV === 'development',
  allowGlobalContext:
    process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined,
  migrations: {
    path: './migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true,
    snapshot: false,
  },
  seeder: {
    path: './src/seeders',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
  pool: {
    min: process.env.NODE_ENV === 'test' ? 1 : 2,
    max: process.env.NODE_ENV === 'test' ? 5 : 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 15000,
  },
  forceUtcTimezone: true,
  strict: true,
};

export default config;
