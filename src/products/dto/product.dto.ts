//if not have mentioned as @isOptional, it will be considered as required by default.
import { IsString, IsOptional, IsNumber, IsBoolean, IsUUID, IsArray, IsEnum, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export enum SortBy {
  NAME = 'name',
  PRICE = 'price',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  SORT_ORDER = 'sortOrder'
}

export enum Order {
  ASC = 'asc',
  DESC = 'desc'
}

export class CreateProductDto {
  @ApiProperty({ example: 'Premium Ceylon Cinnamon Powder' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'High-quality cinnamon powder from Sri Lankan organic farms' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Premium quality cinnamon powder perfect for baking and cooking' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({ example: 1250.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 1500.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  comparePrice?: number;

  @ApiPropertyOptional({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: ['https://example.com/cinnamon1.jpg', 'https://example.com/cinnamon2.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // each: true means each element in the array should be a string
  images?: string[];

  @ApiPropertyOptional({ example: 'CIN-PWD-250G' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: 0.25 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 }) // maxDecimalPlaces: 3 means up to 3 digits after decimal point
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 'kg' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: ['organic', 'spice', 'baking', 'premium'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 4.5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  review?: number;

  @ApiPropertyOptional({ example: 25, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewCount?: number;

  @ApiProperty({ example: '6f9c1b2e-3f4a-4a0e-9c88-8b1c0e5a4f23' })
  @IsUUID()
  categoryId: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Premium Ceylon Cinnamon Powder' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'High-quality cinnamon powder from Sri Lankan organic farms' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Premium quality cinnamon powder perfect for baking and cooking' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 1250.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 1500.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  comparePrice?: number;

  @ApiPropertyOptional({ example: 'LKR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: ['https://example.com/cinnamon1.jpg', 'https://example.com/cinnamon2.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 'CIN-PWD-250G' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: 0.25 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 'kg' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: ['organic', 'spice', 'baking', 'premium'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 4.5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  review?: number;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewCount?: number;

  @ApiPropertyOptional({ example: '6f9c1b2e-3f4a-4a0e-9c88-8b1c0e5a4f23' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class GetProductsQueryDto { // we can use this dto to validate and document the query parameters for getting products list based on different filters, sorting, and pagination options.
  @ApiPropertyOptional({ example: 'cinnamon' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 2000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 'pepper' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'price', enum: SortBy })
  @IsOptional()
  @IsEnum(SortBy) //enum validation to ensure the value is one of the defined SortBy enum values
  sortBy?: SortBy; // here we are defining the structure of the sortBy query parameter.

  @ApiPropertyOptional({ example: 'asc', enum: Order })
  @IsOptional()
  @IsEnum(Order)
  order?: Order;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number) // to transform the query param from string to number
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true') // to transform the query param from string to boolean. here we are checking if the string value is 'true', then it will be converted to boolean true, otherwise false.
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isFeatured?: boolean;
}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  shortDescription?: string;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  comparePrice?: number;

  @ApiProperty()
  currency: string;

  @ApiPropertyOptional()
  images?: string[];

  @ApiPropertyOptional()
  sku?: string;

  @ApiPropertyOptional()
  weight?: number;

  @ApiPropertyOptional()
  unit?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  inStock: boolean;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiPropertyOptional()
  tags?: string[];

  @ApiPropertyOptional()
  review?: number;

  @ApiProperty()
  reviewCount: number;

  @ApiProperty()
  categoryId: string;

  @ApiPropertyOptional()
  category?: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  hasPreviousPage: boolean;
}