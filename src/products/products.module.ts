import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, Category } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])], // Import TypeOrmModule with Product and Category entities
  controllers: [ProductsController], // Register ProductsController to handle incoming requests
  providers: [ProductsService], // Provide ProductsService for dependency injection
  exports: [ProductsService], // Export ProductsService to make it available for other modules
})
export class ProductsModule {}
