import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import jwtConfig from './jwt.config';
import appConfig from './app.config';
import { TypeOrmConfigService } from './typeorm.config';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [jwtConfig, appConfig],
      validationSchema: Joi.object({
        // Database
        DATABASE_HOST: Joi.string().default('localhost'),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.string().default('postgres'),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().default('bsc_organics'),
        DATABASE_SSL: Joi.boolean().default(false),
        
        // App
        PORT: Joi.number().default(3001),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        API_PREFIX: Joi.string().default('api/v1'),
        
        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().default('24h'),
        
        // File Upload
        MAX_FILE_SIZE: Joi.number().default(10485760), // 10MB
        UPLOAD_DEST: Joi.string().default('./uploads'),
        
        // Logging
        LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
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
