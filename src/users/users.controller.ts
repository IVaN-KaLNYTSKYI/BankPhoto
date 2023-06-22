import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../guards/jwt.guard';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { AuthTokenDto } from '../auth/dto/auth.token.dto';
import { CurrentUserDescriptor } from './decorator/current-user-descriptor.decorator';
import { Users } from './users.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('sign-up')
  registerUser(@Body() dto: CreateUserRequestDto): Promise<AuthTokenDto> {
    return this.userService.createUser(dto);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getUserById(
    @CurrentUserDescriptor() dto: { userId: number },
  ): Promise<Users> {
    return this.userService.getUserById(dto.userId);
  }
}
