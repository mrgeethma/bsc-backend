import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // Global exception filter to handle all unhandled exceptions
import helmet from 'helmet'; // Helmet helps secure Express apps by setting various HTTP headers and is a security best practice
import express from 'express'; // Import Express framework for creating the server
import { ExpressAdapter } from '@nestjs/platform-express'; // Adapter to use Express with NestJS and this allows us to leverage Express middleware and features
import * as bodyParser from 'body-parser'; // Body parsing middleware to handle JSON and URL-encoded payloads

async function bootstrap() {

  const expressApp = express(); // Create an Express application instance
  expressApp.disable('x-powered-by'); // disable 'X-Powered-By' header. Security best practice. what does this do? It hides the fact that the server is running Express, reducing information exposure to potential attackers.

  const app = await NestFactory.create(AppModule, // Create NestJS application instance
    new ExpressAdapter(expressApp) 
  ); // Create Nest app using Express adapter. why use Express adapter? To leverage Express middleware and features.
  
  expressApp.use(bodyParser.json({ limit: '10mb' }));  // Body parsing middleware. Increase payload size limit.
  expressApp.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // Body parsing middleware for URL-encoded data
  app.setGlobalPrefix('api/v1');
  app.use(  // Use Helmet for security headers. what is Helmet? Helmet helps secure Express apps by setting various HTTP headers like HSTS, XSS Protection, etc.
    helmet({
      contentSecurityPolicy: false, // Configure CSP(content Security Policy) as needed. Disable for simplicity, but should be enabled in production with proper settings.
    }),
  );

  app.enableCors({  // Enable CORS
    origin: '*', // Configure appropriately for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*', // Allow all headers for CORS like Authorization. Adjust as needed for security.
    credentials: true, // Allow credentials in CORS requests
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true}));  // Enable global validation pipe. here: transform - auto transform payloads to DTO instances; whitelist - strip non-whitelisted properties; forbidNonWhitelisted - throw error on non-whitelisted properties. in simply whitelisted properties mean only properties defined in the DTO will be accepted.
  app.useGlobalFilters(new AllExceptionsFilter());  // Use global exception filter. this filter will catch all unhandled exceptions and format the response.

  const port = process.env.PORT || 3001
  await app.listen(port); //Start listening on configured port which means the server is now running and ready to accept requests on the specified port.
  
    console.log(`🚀 BSC Organics API is running on: http://localhost:${port}`);
}
bootstrap(); // Bootstrap the application