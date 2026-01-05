import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AdminRegisterDto, AuthResponseDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../entities';
import { ResponseUtil } from '../common/utils/response.util';
import type { ApiResponse as ApiResponseType } from '../common/utils/response.util';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponseType<{ user: any; message: string }>> {
    const result = await this.authService.register(registerDto);
    return ResponseUtil.created(result, result.message);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: AuthResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseType<AuthResponseDto>> {
    const result = await this.authService.login(loginDto);
    return ResponseUtil.ok(result, 'Login successful');
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/register')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new admin (Admin only)' })
  @ApiBody({ type: AdminRegisterDto })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  async registerAdmin(@Body() adminRegisterDto: AdminRegisterDto): Promise<ApiResponseType<{ user: any; message: string }>> {
    const result = await this.authService.registerAdmin(adminRegisterDto);
    return ResponseUtil.created(result, result.message);
  }
}
