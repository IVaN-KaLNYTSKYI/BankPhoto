import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, IsNull } from 'typeorm';
import { Users } from './users.entity';
import * as bcrypt from 'bcrypt';
import { AppConfig } from '../common/app-config';
import { Auth } from '../auth/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { AuthTokenDto } from '../auth/dto/auth.token.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly connection: Connection,
  ) {}

  async createUser(dto: CreateUserRequestDto): Promise<AuthTokenDto> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const userExists = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (userExists) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = this.userRepository.create({
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      });

      const createdUser = await this.userRepository.save(user);

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

      const userAuth = this.authRepository.create({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: createdUser,
      });

      await this.authRepository.save(userAuth);

      await queryRunner.commitTransaction();

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to register user');
    } finally {
      await queryRunner.release();
    }
  }

  async getUserById(userId: number): Promise<Users> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['photos', 'auth'],
    });
  }

  private async generateToken(
    payload: any,
    expiresIn: string,
    secret: string,
  ): Promise<string> {
    return this.jwtService.sign({ payload }, { expiresIn, secret });
  }
}
