import { Controller, Get, Post, Body, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createProductDto: CreateProductDto): Promise<ApiResponseType<any>> {
    const product = await this.productsService.create(createProductDto);
    const productWithLocalTime = DateUtil.transformDateFields(product, ['createdAt', 'updatedAt']);
    return ResponseUtil.created(productWithLocalTime, 'Product created successfully');
  }

  @Get()
  @Public()
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
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<any>> {
    const product = await this.productsService.findOne(id);
    const productWithLocalTime = DateUtil.transformDateFields(product, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(productWithLocalTime, 'Product found successfully');
  }

  @Get(':slug')
  @Public()
  async findBySlug(@Param('slug') slug: string): Promise<ApiResponseType<any>> {
    const product = await this.productsService.findBySlug(slug);
    const productWithLocalTime = DateUtil.transformDateFields(product, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(productWithLocalTime, 'Product found successfully');
  }

  @Post('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<null>> {
    await this.productsService.softDelete(id);
    return ResponseUtil.ok(null, 'Product deleted successfully');
  }

  @Post('toggle-status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async toggleActiveStatus(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<any>> {
    const product = await this.productsService.toggleActiveStatus(id);
    const productWithLocalTime = DateUtil.transformDateFields(product, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(productWithLocalTime, 'Product status toggled successfully');
  }
}