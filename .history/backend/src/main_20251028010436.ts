import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for React frontend (development and production)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3001',
      'https://ia03-registration.vercel.app', // Vercel
      'https://ia03-registration.netlify.app', // Netlify
      'https://ia03-registration.onrender.com', // Render
      /\.vercel\.app$/, // Allow all Vercel preview deployments
      /\.netlify\.app$/, // Allow all Netlify preview deployments
    ],
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
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

void bootstrap();
