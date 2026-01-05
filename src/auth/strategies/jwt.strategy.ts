import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  loginTime?: Date;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Validate session: check if token's loginTime matches user's current lastLogin
    // This invalidates old tokens when user logs in again
    if (payload.loginTime && user.lastLogin) {
      const tokenLoginTime = new Date(payload.loginTime);
      const userLastLogin = new Date(user.lastLogin);
      
      // Allow small time difference (1 second) to account for processing delays
      const timeDifference = Math.abs(tokenLoginTime.getTime() - userLastLogin.getTime());
      if (timeDifference > 1000) {
        throw new UnauthorizedException('Session expired - please login again');
      }
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
