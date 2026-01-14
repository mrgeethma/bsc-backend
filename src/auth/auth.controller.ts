import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  AdminRegisterDto,
  AuthResponseDto,
} from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../entities';
import { ResponseUtil } from '../common/utils/response.util';
import { DateUtil } from '../common/utils/date.util';
import type { ApiResponse as ApiResponseType } from '../common/utils/response.util';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ApiResponseType<{ user: any; message: string }>> {
    const result = await this.authService.register(registerDto);
    const resultWithLocalTime = {
      ...result,
      user: DateUtil.transformDateFields(result.user, [
        'createdAt',
        'updatedAt',
      ]),
    };
    return ResponseUtil.created(resultWithLocalTime, result.message);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ApiResponseType<AuthResponseDto>> {
    const result = await this.authService.login(loginDto);
    return ResponseUtil.ok(result, 'Login successful');
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/register')
  async registerAdmin(
    @Body() adminRegisterDto: AdminRegisterDto,
  ): Promise<ApiResponseType<{ user: any; message: string }>> {
    const result = await this.authService.registerAdmin(adminRegisterDto);
    const resultWithLocalTime = {
      ...result,
      user: DateUtil.transformDateFields(result.user, [
        'createdAt',
        'updatedAt',
      ]),
    };
    return ResponseUtil.created(resultWithLocalTime, result.message);
  }
}
