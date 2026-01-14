//what is the purpose of this file? This file defines a ConfigModule in a NestJS application that sets up global configuration management using environment variables. It imports and validates various configuration settings such as database connection details, application settings, JWT settings, file upload limits, and logging levels using Joi schema validation. The module also provides a TypeOrmConfigService for database configuration, making it available for injection throughout the application.
import { Module } from '@nestjs/common'; //common is a built-in module in NestJS that provides core decorators and utilities for creating modules, services, controllers, and other components in a NestJS application.
import { ConfigModule as NestConfigModule } from '@nestjs/config'; //config module from nestjs/config package. it provides a way to manage and access configuration settings in a NestJS application.
import jwtConfig from './jwt.config';
import appConfig from './app.config';
import { TypeOrmConfigService } from './typeorm.config';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      // Configures the global configuration module with environment variables and validation
      isGlobal: true, // Making the configuration module global, so it can be accessed throughout the application without needing to import it in every module.
      envFilePath: ['.env'], // Specifying the path to the environment file(s) to load. here it loads the .env file located at the root of the project.
      load: [jwtConfig, appConfig], // Loading additional configuration files for JWT and application settings.
      validationSchema: Joi.object({
        // Defining a Joi schema to validate environment variables and configuration settings
        // Database
        DATABASE_HOST: Joi.string().default('localhost'),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.string().default('postgres'),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().default('bsc_organics'),
        DATABASE_SSL: Joi.boolean().default(false),

        // App
        PORT: Joi.number().default(3001),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        API_PREFIX: Joi.string().default('api/v1'),

        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().default('24h'),

        // File Upload
        MAX_FILE_SIZE: Joi.number().default(10485760), // 10MB
        UPLOAD_DEST: Joi.string().default('./uploads'),

        // Logging
        LOG_LEVEL: Joi.string()
          .valid('error', 'warn', 'info', 'debug')
          .default('info'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService],
})
export class ConfigModule {}
