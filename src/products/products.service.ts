import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, Category } from '../entities';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

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
      isActive:
        createProductDto.isActive !== undefined
          ? createProductDto.isActive
          : true,
      inStock:
        createProductDto.inStock !== undefined
          ? createProductDto.inStock
          : true,
      isFeatured: createProductDto.isFeatured || false,
      reviewCount: createProductDto.reviewCount || 0,
    });

    return this.productsRepository.save(product);
  }

  async findAllActive(paginationQuery: PaginationQueryDto): Promise<{
    items: Product[];
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  }> {
    const { page = 1, per_page = 10 } = paginationQuery;

    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('product.createdAt', 'DESC');

    // Apply pagination
    queryBuilder.skip((page - 1) * per_page).take(per_page);

    const [items, total_items] = await queryBuilder.getManyAndCount();

    return {
      items,
      page,
      per_page,
      total_items,
      total_pages: Math.ceil(total_items / per_page),
    };
  }

  async findAllForAdmin(paginationQuery: PaginationQueryDto): Promise<{
    items: Product[];
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  }> {
    const { page = 1, per_page = 10 } = paginationQuery;

    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.createdAt', 'DESC');

    // Apply pagination
    queryBuilder.skip((page - 1) * per_page).take(per_page);

    const [items, total_items] = await queryBuilder.getManyAndCount();

    return {
      items,
      page,
      per_page,
      total_items,
      total_pages: Math.ceil(total_items / per_page),
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

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
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
    const updatedProduct = this.productsRepository.merge(
      product,
      updateProductDto,
    );
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
}
