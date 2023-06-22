import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtGuard } from '../guards/jwt.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Auth } from '../auth/auth.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Auth]), JwtModule.register({})],
  providers: [UsersService, JwtGuard],
  controllers: [UsersController],
})
export class UsersModule {}
