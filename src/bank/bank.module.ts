import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { AwsService } from '../aws/aws.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { Bank } from './bank.entity';
import { JwtGuard } from '../guards/jwt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Bank]), JwtModule.register({})],
  providers: [BankService, AwsService, JwtGuard],
  controllers: [BankController],
})
export class BankModule {}
