import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BankModule } from './bank/bank.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from './common/app-config';
import { AwsModule } from './aws/aws.module';
import {GraphqlInterceptor, SentryModule} from '@ntegral/nestjs-sentry';
import {APP_INTERCEPTOR} from "@nestjs/core";

@Module({
  imports: [
    UsersModule,
    BankModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      ...(AppConfig.database as TypeOrmModuleOptions),
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg:ConfigService) => ({
        dsn: 'https://1342b66195da443f42b8e7b3abf92c2e@o4506099732381696.ingest.sentry.io/4506134946447360',
        enabled: true ,
        environment: 'stage'
    }),
    inject: [ConfigService], }),
    AwsModule,
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_INTERCEPTOR,
    useFactory: () => new GraphqlInterceptor(),
  },],
})
export class AppModule {}
