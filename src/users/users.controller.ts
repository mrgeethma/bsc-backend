import { Controller, Get, Post, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities';
import { ResponseUtil } from '../common/utils/response.util';
import type { ApiResponse as ApiResponseType } from '../common/utils/response.util';

@ApiTags('Users') // what this does: it groups the endpoints in Swagger UI under "Users"
@Controller('users')
@UseGuards(JwtAuthGuard) // protects all routes in this controller with JWT authentication. Only authenticated users can access these endpoints and it checks for a valid JWT token in the request headers to verify the user's identity before granting access to the controller's methods.
@ApiBearerAuth() // indicates that this controller uses bearer token authentication (JWT) in the Swagger documentation. it adds a field in the Swagger UI where users can input their JWT token to authenticate requests to the endpoints defined in this controller.
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@Request() req): Promise<ApiResponseType<any>> {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userProfile } = user;
    return ResponseUtil.ok(userProfile, 'Profile retrieved successfully');
  }

  @Post('profile/update')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @Request() req,
    @Body() updateData: { name?: string; mobile?: string }
  ): Promise<ApiResponseType<any>> {
    const updatedUser = await this.usersService.updateProfile(req.user.id, updateData);
    const { password, ...userProfile } = updatedUser;
    return ResponseUtil.ok(userProfile, 'Profile updated successfully');
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers(): Promise<ApiResponseType<any[]>> {
    const users = await this.usersService.findAll();
    return ResponseUtil.ok(users, 'Users retrieved successfully');
  }

  @Post('admin/toggle-active/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Toggle user active status (Admin only)' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async toggleUserActive(@Param('id') id: string): Promise<ApiResponseType<any>> {
    const user = await this.usersService.toggleActive(id);
    return ResponseUtil.ok(user, 'User status updated successfully');
  }
}
