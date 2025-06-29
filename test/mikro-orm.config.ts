import { Options } from '@mikro-orm/core';
import { DEFAULT_PORTS } from '../src/config';

const config: Options = {
  entities: ['./src/entities/*.entity.ts'],
  type: 'postgresql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || DEFAULT_PORTS.DB_TEST.toString(), 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  dbName: process.env.DB_NAME || 'chirp_test',
  debug: false,
  allowGlobalContext: true,
  migrations: {
    path: './migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true,
    snapshot: false,
  },
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
  validateRequired: true,
  forceUtcTimezone: true,
  implicitTransactions: true,
  pool: {
    min: 1,
    max: 5,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 15000,
  },
  strict: true,
  ensureDatabase: false,
};

export default config;
