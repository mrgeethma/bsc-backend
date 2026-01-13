//if not have mentioned as @isOptional, it will be considered as required by default.
import { IsString, IsOptional, IsNumber, IsBoolean, IsUUID, IsArray, IsEnum, IsDateString, Min, Max } from 'class-validator';
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
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  comparePrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // each: true means each element in the array should be a string
  images?: string[];

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 }) // maxDecimalPlaces: 3 means up to 3 digits after decimal point
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  review?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewCount?: number;

  @IsUUID()
  categoryId: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  comparePrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  review?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewCount?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class GetProductsQueryDto { // we can use this dto to validate and document the query parameters for getting products list based on different filters, sorting, and pagination options.
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SortBy) //enum validation to ensure the value is one of the defined SortBy enum values
  sortBy?: SortBy; // here we are defining the structure of the sortBy query parameter.

  @IsOptional()
  @IsEnum(Order)
  order?: Order;

  @IsOptional()
  @Type(() => Number) // to transform the query param from string to number
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true') // to transform the query param from string to boolean. here we are checking if the string value is 'true', then it will be converted to boolean true, otherwise false.
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isFeatured?: boolean;
}

export class ProductResponseDto { // defines the structure of the product data returned in API responses. what is happening here is that it specifies all the properties that a product object will have when it is sent back to the client in response to API requests.
  id: string;

  name: string;

  slug: string;

  description?: string;

  shortDescription?: string;

  price: number;

  comparePrice?: number;

  currency: string;

  images?: string[];

  sku?: string;

  weight?: number;

  unit?: string;

  isActive: boolean;

  inStock: boolean;

  isFeatured: boolean;

  sortOrder: number;

  tags?: string[];

  review?: number;

  reviewCount: number;

  categoryId: string;

  category?: {
    id: string;
    name: string;
    slug: string;
  };

  createdAt: Date;

  updatedAt: Date;
}

export class PaginatedProductsResponseDto { // defines the structure of a paginated response for a list of products. what is happening here is that it specifies that the response will include an array of product data along with pagination metadata such as total items, current page, items per page, total pages, and indicators for next and previous pages.
  data: ProductResponseDto[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}
