import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer'; // to transform incoming string to int. here we use it for sortOrder.

export class CreateCategoryDto {
  @IsString() //here we haven't used IsNotEmpty() or IsOptional() so it is required by default.
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  sortOrder?: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  sortOrder?: number;
}

//required means must exist(no @IsOptional()) and cannot be null or undefined.
//optional means may or may not exist(can be undefined) but if it exists, it cannot be null.
//if the request HAS an extra field NOT in the DTO, it will be IGNORED and NOT cause an error.(whitelist: true Removes fields that are NOT in the DTO)
