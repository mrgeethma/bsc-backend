import { Controller, Get, Post, Body, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, GetProductsQueryDto, ProductResponseDto, PaginatedProductsResponseDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../entities';
import { ResponseUtil } from '../common/utils/response.util';
import { DateUtil } from '../common/utils/date.util';
import type { ApiResponse as ApiResponseType } from '../common/utils/response.util';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: ProductResponseDto })
  async create(@Body() createProductDto: CreateProductDto): Promise<ApiResponseType<any>> {
    const product = await this.productsService.create(createProductDto);
    const productWithLocalTime = DateUtil.transformDateFields(product, ['createdAt', 'updatedAt']);
    return ResponseUtil.created(productWithLocalTime, 'Product created successfully');
  }

  @Get()
  @Public()
  @ApiOperation({ 
    summary: 'Get all active products with filtering, sorting, and pagination',
    description: 'Returns only active products (isActive: true). Supports filtering by category, price range, search term, and various product attributes. Also supports sorting and pagination.'
  })
  @ApiResponse({ status: 200, description: 'Active products retrieved successfully', type: PaginatedProductsResponseDto })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category slug (e.g., cinnamon)' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter (e.g., 500)', type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter (e.g., 2000)', type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Search in product name, description, or tags (e.g., pepper)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field', enum: ['name', 'price', 'createdAt', 'updatedAt', 'sortOrder'] })
  @ApiQuery({ name: 'order', required: false, description: 'Sort order', enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)', type: Number })
  @ApiQuery({ name: 'inStock', required: false, description: 'Filter by stock availability', type: Boolean })
  @ApiQuery({ name: 'isFeatured', required: false, description: 'Filter by featured status', type: Boolean })
  async findActiveProducts(@Query() query: GetProductsQueryDto): Promise<ApiResponseType<PaginatedProductsResponseDto>> {
    const result = await this.productsService.findActiveProducts(query);
    
    // Transform date fields for all products in the result
    const transformedData = {
      ...result,
      data: DateUtil.transformArrayDateFields(result.data, ['createdAt', 'updatedAt'])
    };
    
    return ResponseUtil.ok(transformedData, 'Active products retrieved successfully');
  }



  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get all products including inactive (Admin only)',
    description: 'Admin endpoint to retrieve all products with the same filtering and sorting capabilities, but includes inactive products'
  })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully', type: PaginatedProductsResponseDto })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category slug (e.g., cinnamon)' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter (e.g., 500)', type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter (e.g., 2000)', type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Search in product name, description, or tags (e.g., pepper)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field', enum: ['name', 'price', 'createdAt', 'updatedAt', 'sortOrder'] })
  @ApiQuery({ name: 'order', required: false, description: 'Sort order', enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)', type: Number })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status', type: Boolean })
  @ApiQuery({ name: 'inStock', required: false, description: 'Filter by stock availability', type: Boolean })
  @ApiQuery({ name: 'isFeatured', required: false, description: 'Filter by featured status', type: Boolean })
  async findAllForAdmin(@Query() query: GetProductsQueryDto): Promise<ApiResponseType<PaginatedProductsResponseDto>> {
    const result = await this.productsService.findAllProducts(query);
    
    // Transform date fields for all products in the result
    const transformedData = {
      ...result,
      data: DateUtil.transformArrayDateFields(result.data, ['createdAt', 'updatedAt'])
    };
    
    return ResponseUtil.ok(transformedData, 'All products retrieved successfully');
  }

  @Get('id/:id')
  @Public()
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found successfully', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<any>> {
    const product = await this.productsService.findOne(id);
    const productWithLocalTime = DateUtil.transformDateFields(product, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(productWithLocalTime, 'Product found successfully');
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get a product by slug' })
  @ApiResponse({ status: 200, description: 'Product found successfully', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findBySlug(@Param('slug') slug: string): Promise<ApiResponseType<any>> {
    const product = await this.productsService.findBySlug(slug);
    const productWithLocalTime = DateUtil.transformDateFields(product, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(productWithLocalTime, 'Product found successfully');
  }

  @Post('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ApiResponseType<any>> {
    const product = await this.productsService.update(id, updateProductDto);
    const productWithLocalTime = DateUtil.transformDateFields(product, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(productWithLocalTime, 'Product updated successfully');
  }

  @Post('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<null>> {
    await this.productsService.softDelete(id);
    return ResponseUtil.ok(null, 'Product deleted successfully');
  }

  @Post('toggle-status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle product active status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product status toggled successfully', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async toggleActiveStatus(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<any>> {
    const product = await this.productsService.toggleActiveStatus(id);
    const productWithLocalTime = DateUtil.transformDateFields(product, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(productWithLocalTime, 'Product status toggled successfully');
  }
}