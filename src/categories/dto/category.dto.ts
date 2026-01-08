import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Whole Spices' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Premium quality whole spices sourced from organic farms' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  sortOrder?: number;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Whole Spices' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Premium quality whole spices sourced from organic farms' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  sortOrder?: number;
}

//required means must exist(no @IsOptional()) and cannot be null or undefined.
//optional means may or may not exist(can be undefined) but if it exists, it cannot be null.
//if the request HAS an extra field NOT in the DTO, it will be IGNORED and NOT cause an error.(whitelist: true Removes fields that are NOT in the DTO)