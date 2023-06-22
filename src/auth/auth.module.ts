import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtGuard } from '../guards/jwt.guard';
import { Auth } from './auth.entity';
import { Users } from '../users/users.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, Users]), JwtModule.register({})],
  providers: [AuthService, JwtGuard],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
