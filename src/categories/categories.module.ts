import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Import TypeOrmModule with Category entity to enable database operations
  controllers: [CategoriesController], // Register CategoriesController to handle incoming requests
  providers: [CategoriesService], // Provide CategoriesService for dependency injection
  exports: [CategoriesService], // Export CategoriesService to make it available for other modules
})
export class CategoriesModule {} // Define and export CategoriesModule to encapsulate category-related functionality which means it can be imported into other modules
