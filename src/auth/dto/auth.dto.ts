import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../entities';

// Public registration DTO - only for customers
export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+94771234567', required: false })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
  
  // Role is not included - automatically set to CUSTOMER
}

// Admin registration DTO - for admin-only endpoint
export class AdminRegisterDto {
  @ApiProperty({ example: 'Admin User' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@bscorganics.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+94771234568', required: false })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({ example: 'AdminPassword123!' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8) // Stronger password requirement for admins
  password: string;

  @ApiProperty({ example: UserRole.ADMIN, enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty()
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };

  @ApiProperty()
  accessToken: string;
}
