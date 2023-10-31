import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  /*Sentry.init({
    dsn: 'https://1342b66195da443f42b8e7b3abf92c2e@o4506099732381696.ingest.sentry.io/4506134946447360',
    environment:'stage'
  });*/
  await app.listen(3000);
}
bootstrap();
