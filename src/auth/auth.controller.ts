import { Controller, Post, Body, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LoginRequestDto } from './dto/login-request.dto';
import { LogoutRequestDto } from './dto/logout-request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }

  @Delete('logout')
  async logout(@Body() dto: LogoutRequestDto) {
    return this.authService.logout(dto);
  }

  @Post('refresh-token')
  async refreshToken(@Body() dto: LogoutRequestDto) {
    const { refreshToken } = dto;
    return this.authService.refreshToken(refreshToken);
  }
}
