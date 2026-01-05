import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, AdminRegisterDto, AuthResponseDto } from './dto/auth.dto';
import { User, UserRole } from '../entities';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: any; message: string }> {
    this.logger.log(`Customer registration attempt for email: ${registerDto.email}`);
    
    // Force customer role for public registration
    const customerData = {
      ...registerDto,
      role: UserRole.CUSTOMER
    };
    
    const user = await this.usersService.create(customerData);
    
    // Don't return token on registration for security
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      message: 'Customer registration successful. Please login to get access token.'
    };
  }

  async registerAdmin(adminRegisterDto: AdminRegisterDto): Promise<{ user: any; message: string }> {
    this.logger.log(`Admin registration attempt for email: ${adminRegisterDto.email}`);
    
    // Only allow ADMIN role creation through this method
    if (adminRegisterDto.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('This endpoint only allows admin account creation');
    }
    
    const user = await this.usersService.create(adminRegisterDto);
    
    // Don't return token on registration for security
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      message: 'Admin registration successful. Please login to get access token.'
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update user's last login to help invalidate old sessions
    await this.usersService.updateLastLogin(user.id);

    return this.generateAuthResponse(user);
  }

  private async generateAuthResponse(user: User): Promise<AuthResponseDto> {
    // Get the user with updated lastLogin timestamp
    const updatedUser = await this.usersService.findById(user.id);
    
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      loginTime: updatedUser?.lastLogin || new Date(), // Include login time in token
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}
