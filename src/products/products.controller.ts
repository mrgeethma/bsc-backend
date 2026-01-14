import { Controller, Get, Post, Body, Param, Query, UseGuards, ParseUUIDPipe, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../entities';
import { ResponseUtil } from '../common/utils/response.util';
import { DateUtil } from '../common/utils/date.util';
import { ERROR_MESSAGES } from '../common/constants/error-messages';
import type { ApiResponse as ApiResponseType } from '../common/utils/response.util';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Public()
  async findAllActive(@Query() dto: PaginationQueryDto): Promise<ApiResponseType<any>> {
    const result = await this.productsService.findAllActive(dto);
    const productsWithLocalTime = {
      ...result,
      items: result.items.map(product => DateUtil.transformDateFields(product, ['createdAt', 'updatedAt'])),
    };
    return ResponseUtil.ok(productsWithLocalTime, 'Products retrieved successfully');
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllForAdmin(@Query() dto: PaginationQueryDto): Promise<ApiResponseType<any>> {
    const result = await this.productsService.findAllForAdmin(dto);
    const productsWithLocalTime = {
      ...result,
      items: result.items.map(product => DateUtil.transformDateFields(product, ['createdAt', 'updatedAt'])),
    };
    return ResponseUtil.ok(productsWithLocalTime, 'All products retrieved successfully');
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateProductDto): Promise<ApiResponseType<any>> {
    const product = await this.productsService.create(dto);
    const productWithLocalTime = DateUtil.transformDateFields(product, ['createdAt', 'updatedAt']); // here we are transforming the createdAt and updatedAt fields of the product to local time using DateUtil before sending the response.
    return ResponseUtil.created(productWithLocalTime, 'Product created successfully');
  }

  @Get('id/:id') //normally get by id is admin only, but here we are providing public access for testing purpose
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
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto): Promise<ApiResponseType<any>> {
    const product = await this.productsService.update(id, dto);
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