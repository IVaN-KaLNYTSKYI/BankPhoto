import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World11111';
  }
  getHello2(): string {
    return 'Hello World!';
  }
}
