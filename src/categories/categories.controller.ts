import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../entities';
import { ResponseUtil } from '../common/utils/response.util';
import type { ApiResponse as ApiResponseType } from '../common/utils/response.util';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ApiResponseType<any>> {
    const category = await this.categoriesService.create(createCategoryDto);
    return ResponseUtil.created(category, 'Category created successfully');
  }

  @Get('all')
  @Public()
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async findAll(): Promise<ApiResponseType<any[]>> {
    const categories = await this.categoriesService.findAll();
    return ResponseUtil.ok(categories, 'Categories retrieved successfully');
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories including inactive (Admin only)' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async findAllForAdmin(): Promise<ApiResponseType<any[]>> {
    const categories = await this.categoriesService.findAllForAdmin();
    return ResponseUtil.ok(categories, 'Categories retrieved successfully');
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<any>> {
    const category = await this.categoriesService.findOne(id);
    return ResponseUtil.ok(category, 'Category retrieved successfully');
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponseType<any>> {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return ResponseUtil.ok(category, 'Category updated successfully');
  }

  @Post('toggle-active/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle category active status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category status updated successfully' })
  async toggleActive(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<any>> {
    const category = await this.categoriesService.toggleActive(id);
    return ResponseUtil.ok(category, 'Category status updated successfully');
  }

  @Post('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<null>> {
    await this.categoriesService.softDelete(id);
    return ResponseUtil.ok(null, 'Category deleted successfully');
  }
}
