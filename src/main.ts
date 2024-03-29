import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log']
  });
  
  app.use(helmet());

  // ? add URI versioning potentially?
  
  await app.listen(3000);
}
bootstrap();
