import {Controller, Get, UseInterceptors,BadRequestException} from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    throw new BadRequestException('User email does not exist');
    return this.appService.getHello();
  }
}
