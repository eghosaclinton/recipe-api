import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

//TODO: DO SOMETHING ABOUT IMAGE UPLOADS
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });

  app.setGlobalPrefix('/api');

  app.use(cookieParser());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          // Add connect-src if you are using specific analytics or data fetching from other domains
          // connectSrc: ["'self'", 'cdn.jsdelivr.net'],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/api/docs',
    // eslint-disable-next-line
    apiReference({
      content: document,
      // theme: 'elysiajs',
      theme: 'fastify',
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();
