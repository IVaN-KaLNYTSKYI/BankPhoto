import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { LoginRequestDto } from './dto/login-request.dto';
import { Users } from '../users/users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenDto } from './dto/auth.token.dto';
import { ConfigService } from '@nestjs/config';
import { LogoutRequestDto } from './dto/logout-request.dto';
import { AppConfig } from '../common/app-config';
import { verifyTokenDto } from './dto/verify-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto): Promise<AuthTokenDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('User email does not exist');
    }

    const isPassword = await bcrypt.compare(dto.password, user.password);

    if (!isPassword) {
      throw new UnauthorizedException('password or email is incorrect');
    }

    const accessToken = await this.generateToken(
      { id: user.id, email: user.email },
      AppConfig.jwt.accessTokenExpiration,
      AppConfig.jwt.accessTokenSecret,
    );
    const refreshToken = await this.generateToken(
      { id: user.id, email: user.email },
      AppConfig.jwt.refreshTokenExpiration,
      AppConfig.jwt.refreshTokenSecret,
    );

    const auth = await this.authRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (auth) {
      const authUpdate = Object.assign(auth, {
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      await this.authRepository.save(authUpdate);

      return { accessToken, refreshToken };
    }

    const userAuth = this.authRepository.create({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: user,
    });

    await this.authRepository.save(userAuth);

    return { accessToken, refreshToken };
  }

  async logout(dto: LogoutRequestDto) {
    const user = await this.authRepository.findOne({
      where: { refresh_token: dto.refreshToken },
    });

    if (user) {
      await this.authRepository.remove(user);
    }

    return {
      message: 'Logout successfully.',
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const auth = await this.authRepository.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!auth) {
      throw new UnauthorizedException('User is not found');
    }

    const payload = await this.verifyToken(
      refreshToken,
      AppConfig.jwt.refreshTokenSecret,
    );
    const accessToken = await this.generateToken(
      {
        id: payload.userId,
        email: payload.email,
        profileId: payload.profileId,
      },
      AppConfig.jwt.accessTokenExpiration,
      AppConfig.jwt.accessTokenSecret,
    );

    auth.access_token = accessToken;
    const updateAccessToken = await this.authRepository.save(auth);

    return { accessToken: updateAccessToken.access_token };
  }

  private async generateToken(
    payload: any,
    expiresIn: string,
    secret: string,
  ): Promise<string> {
    return this.jwtService.sign({ payload }, { expiresIn, secret });
  }

  private async verifyToken(
    token: string,
    secret: string,
  ): Promise<verifyTokenDto> {
    try {
      const { payload } = this.jwtService.verify(token, { secret });
      return {
        userId: payload.id,
        email: payload.email,
        profileId: payload.profileId,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
