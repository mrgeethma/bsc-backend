import { Module } from '@nestjs/common'; // import Module decorator to define a NestJS module from NestJS common package.
import { ConfigModule } from '@nestjs/config'; // import ConfigModule to access environment variables and application settings from @nestjs/config package
import { TypeOrmModule } from '@nestjs/typeorm'; // import TypeOrmModule to integrate TypeORM with NestJS for database connectivity and ORM features from @nestjs/typeorm package
import { AppController } from './app.controller'; // import AppController to handle incoming requests and define application routes
import { TypeOrmConfigService } from './config/typeorm.config'; // import TypeOrmConfigService to provide TypeORM configuration settings from a custom config file
import { validationSchema } from './config/validation.config'; // import validationSchema to validate environment variables and application settings from a custom config file with Joi schema
import { AuthModule } from './auth/auth.module'; // import AuthModule to handle authentication and authorization features from a custom auth module
import { UsersModule } from './users/users.module'; // import UsersModule to manage user-related operations and features from a custom users module
import { CategoriesModule } from './categories/categories.module'; // import CategoriesModule to manage product categories and related features from a custom categories module
import { ProductsModule } from './products/products.module'; // import ProductsModule to manage products and related features from a custom products module

@Module({
  imports: [
    ConfigModule.forRoot({
      // Configure ConfigModule to load environment variables and settings from root level
      isGlobal: true, // make ConfigModule globally available across the application
      validationSchema, // validate environment variables using the imported Joi schema
    }),
    TypeOrmModule.forRootAsync({
      // Configure TypeOrmModule asynchronously to allow dynamic configuration like loading from environment variables.
      useClass: TypeOrmConfigService, // use the imported TypeOrmConfigService to provide TypeORM configuration settings from a custom config file
    }),
    AuthModule, // Import AuthModule to handle authentication and authorization features
    UsersModule, // Import UsersModule to manage user-related operations and features
    CategoriesModule, // Import CategoriesModule to manage product categories and related features
    ProductsModule, // Import ProductsModule to manage products and related features
  ],
  controllers: [AppController],
})
export class AppModule {} // Export AppModule as the root module of the application
