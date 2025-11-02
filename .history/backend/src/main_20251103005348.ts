import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for React frontend (development and production)
  // TODO: Replace with your actual frontend URL in production
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? [
          'https://ia03-registration.vercel.app',
          'https://ia03-registration.netlify.app',
          'https://ia03-registration.onrender.com',
          /\.vercel\.app$/, // All Vercel preview deployments
          /\.netlify\.app$/, // All Netlify preview deployments
        ]
      : [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:3000',
          'http://localhost:3001',
        ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

void bootstrap();
