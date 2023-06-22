import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../common/app-config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const { payload } = this.jwtService.verify(token, {
        secret: AppConfig.jwt.accessTokenSecret,
      });
      request.user = { userId: payload.id, profileId: payload.profileId };

      return true;
    } catch (error) {
      return false;
    }
  }
}
