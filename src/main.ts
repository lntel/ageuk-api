import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log']
  });

  const config = new DocumentBuilder()
  .setTitle('AgeUK API')
  .setDescription('This documents AgeUK\'s care API')
  .setVersion('1.0')
  .addTag('auth')
  .addBearerAuth({
    type: 'http',
    bearerFormat: 'Bearer token'
  })
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.use(helmet());

  app.enableCors();

  // ? add URI versioning potentially?
  
  await app.listen(5000);
}
bootstrap();
