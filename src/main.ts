import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import helmet from 'helmet';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  // Create Express app instance and disable 'X-Powered-By' header
  const expressApp = express();
  expressApp.disable('x-powered-by');

  // Create Nest app using Express adapter
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  // Body parsing middleware
  expressApp.use(bodyParser.json({ limit: '10mb' }));
  expressApp.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  // Global route prefix
  app.setGlobalPrefix('api/v1');

  // Use Helmet for security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Configure CSP as needed
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: '*', // Configure appropriately for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Use global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Setup Swagger API docs
  const config = new DocumentBuilder()
    .setTitle('BSC Organics API')
    .setDescription('E-commerce API for spices and organic products')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start listening on configured port
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 BSC Organics API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
}
bootstrap();