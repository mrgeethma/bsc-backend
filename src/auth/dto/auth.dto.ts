import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { UserRole } from '../../entities';

// Public registration DTO - only for customers
export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  // Role is not included - automatically set to CUSTOMER
}

// Admin registration DTO - for admin-only endpoint
export class AdminRegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8) // Stronger password requirement for admins
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class AuthResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };

  accessToken: string;
}
