import { Controller, Get, Post, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities';
import { ResponseUtil } from '../common/utils/response.util';
import { DateUtil } from '../common/utils/date.util';
import type { ApiResponse as ApiResponseType } from '../common/utils/response.util';
import { ResetPasswordDto } from './dto/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard) // protects all routes in this controller with JWT authentication. Only authenticated users can access these endpoints and it checks for a valid JWT token in the request headers to verify the user's identity before granting access to the controller's methods.
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req): Promise<ApiResponseType<any>> { // what is @Request() req does is it injects the entire request object into the method, allowing access to properties like req.user which contains the authenticated user's information extracted from the JWT token. for example, req.user = { id: 5, email: 'test@mail.com' }
    const user = await this.usersService.findById(req.user.id); // Fetch user from database using logged-in user's ID.  Fetch the user profile using the ID obtained from the JWT token. for this we call usersService.findById with req.user.id to get the full user details from the database.
    if (!user) { 
      throw new NotFoundException('User not found');
    }
    const { password, ...userProfile } = user; // Remove password field before sending response. Destructure the user object to exclude the password field from the response for security reasons. how it works: it uses JavaScript destructuring to separate the password property from the rest of the user object. The ...userProfile syntax collects all other properties into a new object called userProfile, effectively omitting the password.
    const profileWithLocalTime = DateUtil.transformDateFields(userProfile, ['createdAt', 'updatedAt', 'lastLogin']);
    return ResponseUtil.ok(profileWithLocalTime, 'Profile retrieved successfully');
  }

  @Post('profile/update') //*************
  async updateProfile(
    @Request() req,
    @Body() updateData: { name?: string; mobile?: string }
  ): Promise<ApiResponseType<any>> {
    const updatedUser = await this.usersService.updateProfile(req.user.id, updateData);
    const { password, ...userProfile } = updatedUser;
    const profileWithLocalTime = DateUtil.transformDateFields(userProfile, ['createdAt', 'updatedAt', 'lastLogin']);
    return ResponseUtil.ok(profileWithLocalTime, 'Profile updated successfully');
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers(): Promise<ApiResponseType<any[]>> {
    const users = await this.usersService.findAll();
    const usersWithLocalTime = DateUtil.transformArrayDateFields(users, ['createdAt']);
    return ResponseUtil.ok(usersWithLocalTime, 'Users retrieved successfully');
  }

  @Post('toggle-active/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async toggleActive(@Param('id') id: string): Promise<ApiResponseType<any>> {
    const user = await this.usersService.toggleActive(id);
    const userWithLocalTime = DateUtil.transformDateFields(user, ['createdAt', 'updatedAt', 'lastLogin']);
    return ResponseUtil.ok(userWithLocalTime, 'User status updated successfully');
  }

  @Post('profile/reset-password')
  async resetPassword(@Request() req, @Body() resetPasswordDto: ResetPasswordDto): Promise<ApiResponseType<any>> {
    const user = await this.usersService.resetPassword(req.user.id, resetPasswordDto);
    const { password, ...userProfile } = user;
    const profileWithLocalTime = DateUtil.transformDateFields(userProfile, ['createdAt', 'updatedAt', 'lastLogin']);
    return ResponseUtil.ok(profileWithLocalTime, 'Password reset successfully');
  }
    
  @Post('profile/deactivate')
  async deactivateProfile(@Request() req): Promise<ApiResponseType<any>> {
    await this.usersService.deactivateUser(req.user.id);
    return ResponseUtil.ok(null, 'User account deactivated successfully');
  }
  
 

}
