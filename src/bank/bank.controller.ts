import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBankRequestDto } from './dto/create-bank-request.dto';
import { Bank } from './bank.entity';
import { BankService } from './bank.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUserDescriptor } from '../users/decorator/current-user-descriptor.decorator';
import {JwtGuard} from "../guards/jwt.guard";

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @UseGuards(JwtGuard)
  @Post('photo/create')
  @UseInterceptors(FileInterceptor('avatar'))
  registerUser(
    @CurrentUserDescriptor() user: { userId: number },
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateBankRequestDto,
  ): Promise<Bank> {
    return this.bankService.createPhoto(dto, file, user.userId);
  }

  @UseGuards(JwtGuard)
  @Post('photo/delete')
  async deleteAvatar(
      @CurrentUserDescriptor() user: { userId: number },
      @Body() dto:any
  ): Promise<{message:string}> {
    return await this.bankService.deletePhoto(dto,user.userId);
  }
}
