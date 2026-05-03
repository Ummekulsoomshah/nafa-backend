import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── 1. Global Exception Filter ─────────────────────────────────────────────
  // Must be registered FIRST — catches every unhandled error app-wide
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ── 2. Global Validation Pipe ──────────────────────────────────────────────
  // Automatically validates all incoming DTOs and returns friendly messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // strips unknown fields silently
      forbidNonWhitelisted: false,  // don't throw on extra fields — just strip
      transform: true,              // auto-converts types (string "1" → number 1)
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        // Flatten all DTO validation errors into one readable sentence
        const messages = errors.map((err) =>
          Object.values(err.constraints ?? {}).join(', ')
        );
        const { BadRequestException } = require('@nestjs/common');
        return new BadRequestException(messages.join('. '));
      },
    }),
  );

  // ── 3. CORS ────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  });

  // ── 4. Swagger ─────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Nafa API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('user api')
    .addTag('stock api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ── 5. Graceful shutdown ───────────────────────────────────────────────────
  app.enableShutdownHooks();

  // ── 6. Start ───────────────────────────────────────────────────────────────
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
  logger.log(`Swagger docs at http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  // If bootstrap itself crashes (DB connection, bad config), log it cleanly
  new Logger('Bootstrap').error('Failed to start application', err);
  process.exit(1);
});