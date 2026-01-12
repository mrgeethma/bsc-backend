import { Controller, Get, Post, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../entities';
import { ResponseUtil } from '../common/utils/response.util';
import { DateUtil } from '../common/utils/date.util';
import type { ApiResponse as ApiResponseType } from '../common/utils/response.util';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {} // Injecting CategoriesService to handle business logic related to categories

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protecting route with JWT and role-based guards which means only authenticated users with appropriate roles can access this endpoint
  @Roles(UserRole.ADMIN) // Restricting access to users with ADMIN role
  @ApiBearerAuth() // Indicating that this endpoint requires bearer authentication which means the client must provide a valid JWT token
  @ApiOperation({ summary: 'Create a new category (Admin only)' }) 
  @ApiResponse({ status: 201, description: 'Category created successfully' }) 
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ApiResponseType<any>> { // what is hap 
    const category = await this.categoriesService.create(createCategoryDto);
    const categoryWithLocalTime = DateUtil.transformDateFields(category, ['createdAt', 'updatedAt']); // Transforming date fields to local time format for better readability in the response. if there isn't any date fields, this function will simply return the original object without modifications or we can use as simply return ResponseUtil.created(category, 'Category created successfully');
    return ResponseUtil.created(categoryWithLocalTime, 'Category created successfully'); 
  }

  @Get('all')
  @Public() // Marking this route as public which means it can be accessed without authentication                  
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async findAll(): Promise<ApiResponseType<any[]>> { // what is promise<ApiResponseType<any[]>> does is it indicates that this method returns a Promise that resolves to an ApiResponseType containing an array of any type which means the response will include a list of categories
    const categories = await this.categoriesService.findAll(); // Fetching all active categories from the service and storing them in the categories variable which is a list(array) of category objects
    const categoriesWithLocalTime = DateUtil.transformArrayDateFields(categories, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(categoriesWithLocalTime, 'Categories retrieved successfully'); // Returning a standardized success response with the list of categories and a success message
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories including inactive (Admin only)' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async findAllForAdmin(): Promise<ApiResponseType<any[]>> {
    const categories = await this.categoriesService.findAllForAdmin();
    const categoriesWithLocalTime = DateUtil.transformArrayDateFields(categories, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(categoriesWithLocalTime, 'Categories retrieved successfully');
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<any>> { // what is ParseUUIDPipe does is it validates and transforms the 'id' parameter to ensure it is a VALID UUID FORMAT which means if the 'id' is not a valid UUID, an error will be thrown before reaching the service layer and stop further processing
    const category = await this.categoriesService.findOne(id);
    const categoryWithLocalTime = DateUtil.transformDateFields(category, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(categoryWithLocalTime, 'Category retrieved successfully');
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto,): Promise<ApiResponseType<any>> { //ParseUUIDPipe is used to validate that the id parameter is a valid UUID. if not, it will throw an error before reaching the service layer.
    const category = await this.categoriesService.update(id, updateCategoryDto);
    const categoryWithLocalTime = DateUtil.transformDateFields(category, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(categoryWithLocalTime, 'Category updated successfully');
  }

  @Post('toggle-active/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle category active status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category status updated successfully' })
  async toggleActive(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<any>> {
    const category = await this.categoriesService.toggleActive(id);
    const categoryWithLocalTime = DateUtil.transformDateFields(category, ['createdAt', 'updatedAt']);
    return ResponseUtil.ok(categoryWithLocalTime, 'Category status updated successfully');
  }

  @Post('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseType<null>> {
    await this.categoriesService.softDelete(id);
    return ResponseUtil.ok(null, 'Category deleted successfully');
  }
}
