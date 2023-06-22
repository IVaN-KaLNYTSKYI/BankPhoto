import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from '../users.entity';

export const CurrentUserDescriptor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Users => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.user)
    return request.user;
  },
);
