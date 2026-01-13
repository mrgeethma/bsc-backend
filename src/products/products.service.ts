import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product, Category } from '../entities';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  GetProductsQueryDto, 
  ProductResponseDto, 
  PaginatedProductsResponseDto,
  SortBy,
  Order 
} from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove invalid characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-') // collapse multiple hyphens into a single hyphen
      .trim(); // remove leading and trailing spaces
  }

  private buildProductQuery(
    queryBuilder: SelectQueryBuilder<Product>,
    query: GetProductsQueryDto,
  ): SelectQueryBuilder<Product> {
    // Join with category for filtering and response
    queryBuilder.leftJoinAndSelect('product.category', 'category');

    // Filter by category
    if (query.category) {
      queryBuilder.andWhere('category.slug = :categorySlug', { 
        categorySlug: query.category 
      });
    }

    // Price range filtering
    if (query.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { 
        minPrice: query.minPrice 
      });
    }

    if (query.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { 
        maxPrice: query.maxPrice 
      });
    }

    // Search functionality
    if (query.search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.shortDescription ILIKE :search OR array_to_string(product.tags, \',\') ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    // Filter by active status
    if (query.isActive !== undefined) {
      queryBuilder.andWhere('product.isActive = :isActive', { 
        isActive: query.isActive 
      });
    }

    // Filter by stock status
    if (query.inStock !== undefined) {
      queryBuilder.andWhere('product.inStock = :inStock', { 
        inStock: query.inStock 
      });
    }

    // Filter by featured status
    if (query.isFeatured !== undefined) {
      queryBuilder.andWhere('product.isFeatured = :isFeatured', { 
        isFeatured: query.isFeatured 
      });
    }

    // Sorting
    const sortBy = query.sortBy || SortBy.SORT_ORDER;
    const order = query.order || Order.ASC;

    switch (sortBy) {
      case SortBy.NAME:
        queryBuilder.orderBy('product.name', order.toUpperCase() as 'ASC' | 'DESC');
        break;
      case SortBy.PRICE:
        queryBuilder.orderBy('product.price', order.toUpperCase() as 'ASC' | 'DESC');
        break;
      case SortBy.CREATED_AT:
        queryBuilder.orderBy('product.createdAt', order.toUpperCase() as 'ASC' | 'DESC');
        break;
      case SortBy.UPDATED_AT:
        queryBuilder.orderBy('product.updatedAt', order.toUpperCase() as 'ASC' | 'DESC');
        break;
      case SortBy.SORT_ORDER:
      default:
        queryBuilder.orderBy('product.sortOrder', order.toUpperCase() as 'ASC' | 'DESC');
        queryBuilder.addOrderBy('product.name', 'ASC'); // Secondary sort by name
        break;
    }

    return queryBuilder;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const slug = this.generateSlug(createProductDto.name);
    
    // Check if slug already exists
    const existingProduct = await this.productsRepository.findOne({
      where: { slug },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
    }

    // Verify category exists
    const category = await this.categoriesRepository.findOne({
      where: { id: createProductDto.categoryId, isActive: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found or not active');
    }

    // Check if SKU already exists (if provided)
    if (createProductDto.sku) {
      const existingBySku = await this.productsRepository.findOne({
        where: { sku: createProductDto.sku },
      });

      if (existingBySku) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      slug,
      sortOrder: createProductDto.sortOrder || 0,
      currency: createProductDto.currency || 'LKR',
      isActive: createProductDto.isActive !== undefined ? createProductDto.isActive : true,
      inStock: createProductDto.inStock !== undefined ? createProductDto.inStock : true,
      isFeatured: createProductDto.isFeatured || false,
      reviewCount: createProductDto.reviewCount || 0,
    });

    return this.productsRepository.save(product);
  }

  async findActiveProducts(query: GetProductsQueryDto = {}): Promise<PaginatedProductsResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    
    // Always filter for active products only in this method
    queryBuilder.andWhere('product.isActive = :isActive', { isActive: true });
    
    // Apply filters and sorting
    this.buildProductQuery(queryBuilder, query);

    // Get total count for pagination
    const totalQueryBuilder = queryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    const products = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: products.map(this.mapToResponseDto),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findAllProducts(query: GetProductsQueryDto = {}): Promise<PaginatedProductsResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    
    // Apply filters and sorting (no automatic isActive filter)
    this.buildProductQuery(queryBuilder, query);

    // Get total count for pagination
    const totalQueryBuilder = queryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    const products = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: products.map(this.mapToResponseDto),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findAll(query: GetProductsQueryDto = {}): Promise<PaginatedProductsResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    
    // Apply filters and sorting
    this.buildProductQuery(queryBuilder, query);

    // Get total count for pagination
    const totalQueryBuilder = queryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    const products = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: products.map(this.mapToResponseDto),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id, isActive: true },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { slug, isActive: true },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if name is being updated and generate new slug
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const newSlug = this.generateSlug(updateProductDto.name);
      const existingProduct = await this.productsRepository.findOne({
        where: { slug: newSlug },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('Product with this name already exists');
      }

      updateProductDto['slug'] = newSlug;
    }

    // Verify category exists if being updated
    if (updateProductDto.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateProductDto.categoryId, isActive: true },
      });

      if (!category) {
        throw new NotFoundException('Category not found or not active');
      }
    }

    // Check if SKU is being updated and doesn't conflict
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingBySku = await this.productsRepository.findOne({
        where: { sku: updateProductDto.sku },
      });

      if (existingBySku && existingBySku.id !== id) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    // Merge the updates
    const updatedProduct = this.productsRepository.merge(product, updateProductDto);
    return this.productsRepository.save(updatedProduct);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productsRepository.remove(product);
  }

  async softDelete(id: string): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Soft delete by setting isActive to false
    await this.productsRepository.update(id, { isActive: false });
  }

  async toggleActiveStatus(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Toggle the isActive status
    const updatedProduct = await this.productsRepository.save({
      ...product,
      isActive: !product.isActive,
    });

    return updatedProduct;
  }

  private mapToResponseDto = (product: Product): ProductResponseDto => {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      comparePrice: product.comparePrice,
      currency: product.currency,
      images: product.images,
      sku: product.sku,
      weight: product.weight,
      unit: product.unit,
      isActive: product.isActive,
      inStock: product.inStock,
      isFeatured: product.isFeatured,
      sortOrder: product.sortOrder,
      tags: product.tags,
      review: product.review,
      reviewCount: product.reviewCount,
      categoryId: product.categoryId,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      } : undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  };
}