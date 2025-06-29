import { registerAs } from '@nestjs/config';

// Default port configuration - single source of truth
export const DEFAULT_PORTS = {
  APP: 3000,
  DB_DEV: 5432,
  DB_TEST: 5433,
  REDIS: 6379,
} as const;

// Database configuration
export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST || (process.env.NODE_ENV === 'test' ? 'localhost' : 'localhost'),
  port: parseInt(
    process.env.DB_PORT ||
    (process.env.NODE_ENV === 'test' ? DEFAULT_PORTS.DB_TEST.toString() : DEFAULT_PORTS.DB_DEV.toString()),
    10
  ),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || (process.env.NODE_ENV === 'test' ? 'chirp_test' : 'chirp_db'),
}));

// Application configuration
export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || DEFAULT_PORTS.APP.toString(), 10),
  environment: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  isDocker: process.env.DOCKER_ENV === 'true',
}));

// JWT configuration
export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
}));

// Redis configuration (for future use)
export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || DEFAULT_PORTS.REDIS.toString(), 10),
  password: process.env.REDIS_PASSWORD,
}));

// Export all configurations
export default [
  databaseConfig,
  appConfig,
  jwtConfig,
  redisConfig,
];
