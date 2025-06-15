import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS with specific configuration
    app.enableCors({
      origin: [
        'https://clever-sm-ask.vercel.app', // Production frontend
        'https://clever-sm-six.vercel.app', // Production frontend with port
        'http://localhost:5173',  // Vite dev server
        'http://localhost:3000',  // Alternative frontend port
        'http://localhost:4173',  // Vite preview
        'http://127.0.0.1:5173',  // Alternative localhost
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Access-Control-Allow-Headers',
      ],
      credentials: true,
      optionsSuccessStatus: 200, // For legacy browser support
    });

    // Global validation pipe with transformation
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Change this to false to allow additional properties
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    const port = process.env.PORT || 3000;
    await app.listen(port);
    
    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`🏥 Health check available at: http://localhost:${port}/health`);
    logger.log(`🔍 Database info available at: http://localhost:${port}/health/db`);

  } catch (error) {
    logger.error('❌ Failed to start application', error);
    process.exit(1);
  }
}

bootstrap();
