import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DEFAULT_PORTS } from './config';

// Load environment variables based on NODE_ENV
function loadEnvironment() {
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (nodeEnv === 'test') {
    require('dotenv').config({ path: '.env.test' });
  } else if (process.env.DOCKER_ENV === 'true') {
    require('dotenv').config({ path: '.env.docker' });
  } else {
    require('dotenv').config({ path: '.env.local' });
  }
}

async function bootstrap() {
  loadEnvironment();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const port = parseInt(process.env.PORT || DEFAULT_PORTS.APP.toString(), 10);
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(
    `🗃️ Database: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || DEFAULT_PORTS.DB_DEV}`,
  );
}
bootstrap();
