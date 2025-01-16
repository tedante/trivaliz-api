import './common/configs/sentry.config';
import {
  NestFactory,
  HttpAdapterHost,
  BaseExceptionFilter,
} from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  Sentry.setupNestErrorHandler(app, new BaseExceptionFilter(httpAdapter));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
